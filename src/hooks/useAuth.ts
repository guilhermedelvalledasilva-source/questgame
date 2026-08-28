import { useCallback, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  salt: string;
  passwordHash: string;
}

const USERS_KEY = 'quest-rpg-users';
const SESSION_KEY = 'quest-rpg-session';
const ENTERED_KEY = 'quest-rpg-entered';

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function randomHex(byteLength: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [users, setUsers] = useState<StoredUser[]>(loadUsers);
  const [hasEntered, setHasEntered] = useState<boolean>(() => localStorage.getItem(ENTERED_KEY) === '1');

  const currentUser = userId ? users.find(u => u.id === userId) ?? null : null;

  const enter = useCallback(() => {
    localStorage.setItem(ENTERED_KEY, '1');
    setHasEntered(true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthUser> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) throw new Error('Preencha email e senha.');
    if (password.length < 4) throw new Error('A senha deve ter pelo menos 4 caracteres.');

    const existing = loadUsers();
    if (existing.some(u => u.email === normalizedEmail)) {
      throw new Error('Este email já está cadastrado.');
    }

    const salt = randomHex(16);
    const passwordHash = await hashPassword(password, salt);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      salt,
      passwordHash,
    };

    const updated = [...existing, newUser];
    saveUsers(updated);
    setUsers(updated);
    localStorage.setItem(SESSION_KEY, newUser.id);
    setUserId(newUser.id);
    enter();
    return toAuthUser(newUser);
  }, [enter]);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = loadUsers();
    const found = existing.find(u => u.email === normalizedEmail);
    if (!found) throw new Error('Email não encontrado.');

    const hash = await hashPassword(password, found.salt);
    if (hash !== found.passwordHash) throw new Error('Senha incorreta.');

    setUsers(existing);
    localStorage.setItem(SESSION_KEY, found.id);
    setUserId(found.id);
    enter();
    return toAuthUser(found);
  }, [enter]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUserId(null);
  }, []);

  return {
    currentUser: currentUser ? toAuthUser(currentUser) : null,
    hasEntered,
    enter,
    register,
    login,
    logout,
  };
}

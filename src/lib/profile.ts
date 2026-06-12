/**
 * 참여자 프로필 (닉네임·캐릭터) — 브라우저 localStorage
 * 로그인 없이 같은 기기에서 프로필 유지
 */
import type { CharacterId } from '../constants/characters'

const NICKNAME_KEY = 'nickname'
const CHAR_KEY = 'char'

export function getNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) ?? ''
}

export function getChar(): CharacterId | '' {
  return (localStorage.getItem(CHAR_KEY) as CharacterId) ?? ''
}

export function isProfileComplete(): boolean {
  return Boolean(getNickname() && getChar())
}

export function saveProfile(nickname: string, charId: CharacterId): void {
  localStorage.setItem(NICKNAME_KEY, nickname)
  localStorage.setItem(CHAR_KEY, charId)
}

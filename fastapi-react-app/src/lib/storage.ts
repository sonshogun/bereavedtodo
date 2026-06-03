import type { Board } from '../types'

const KEY = 'btodo_board'

export function getBoard(): Board | null {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as Board) : null
}

export function setBoard(board: Board): void {
  localStorage.setItem(KEY, JSON.stringify(board))
}

export function clearBoard(): void {
  localStorage.removeItem(KEY)
}

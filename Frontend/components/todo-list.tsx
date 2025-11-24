"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

interface TodoItem {
  id: number
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Belajar Next.js", completed: false },
    { id: 2, text: "Selesaikan tugas kuliah", completed: false },
    { id: 3, text: "Baca buku 30 menit", completed: false },
  ])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
        },
      ])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white pb-4">
        <CardTitle className="text-xl">To Do List</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 dark:bg-gray-800">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Tambah task baru..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
          <Button
            onClick={addTodo}
            size="icon"
            className="bg-purple-500 hover:bg-purple-600 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {todos.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-8">
              <p>Belum ada task</p>
              <p className="text-sm">Tambahkan task pertama Anda!</p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 dark:border-gray-600 bg-purple-50/50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-semibold text-purple-600 w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="border-purple-400 data-[state=checked]:bg-purple-500"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Selesai: {todos.filter((t) => t.completed).length}/{todos.length}
            </span>
            <span className="text-purple-600 font-semibold">
              {todos.length > 0
                ? `${Math.round((todos.filter((t) => t.completed).length / todos.length) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  todos.length > 0
                    ? (todos.filter((t) => t.completed).length / todos.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

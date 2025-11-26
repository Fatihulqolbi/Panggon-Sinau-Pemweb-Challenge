"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, AlertCircle, Loader2, Calendar, Tag, Edit } from "lucide-react"
import { todosAPI, type Todo } from "@/lib/api"

interface TodoForm {
  title: string
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Other'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  dueDate?: string
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<TodoForm>({
    title: "",
    category: "Personal",
    priority: "Medium",
  })
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await todosAPI.getAll()
      setTodos(response.todos)
    } catch (err: any) {
      console.error('Fetch todos error:', err)
      // Don't show error if already redirecting to login (API will handle redirect)
      if (!err.message.includes('Session expired')) {
        setError(err.message || "Gagal memuat to-do list. Pastikan Anda sudah login.")
      }
    } finally {
      setLoading(false)
    }
  }
  const addTodo = async () => {
    if (!formData.title.trim()) {
      setError("Title tidak boleh kosong!")
      return
    }

    try {
      if (editingTodo && editingTodo._id) {
        // Update existing todo
        const updatedData = {
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          ...(formData.dueDate && { dueDate: new Date(formData.dueDate) })
        }
        const response = await todosAPI.update(editingTodo._id!, updatedData)
        setTodos(todos.map(todo => 
          todo._id === editingTodo._id ? response.todo : todo
        ))
        setEditingTodo(null)
      } else {
        // Create new todo
        const newTodo = {
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          status: 'pending' as const,
          isCompleted: false,
          ...(formData.dueDate && { dueDate: new Date(formData.dueDate) })
        }

        const response = await todosAPI.create(newTodo)
        setTodos([response.todo, ...todos])
      }
      
      setFormData({
        title: "",
        category: "Personal",
        priority: "Medium",
      })
      setShowForm(false)
      setError("")
    } catch (err: any) {
      console.error('Add/Update todo error:', err)
      setError(err.message || `Gagal ${editingTodo ? 'update' : 'menambah'} todo`)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const response = await todosAPI.toggle(id)
      setTodos(todos.map(todo => 
        todo._id === id ? response.todo : todo
      ))
    } catch (err: any) {
      console.error('Toggle todo error:', err)
      setError(err.message || "Gagal update todo")
    }
  }

  const deleteTodo = async (id: string) => {
    if (!confirm("Hapus todo ini?")) return

    try {
      await todosAPI.delete(id)
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (err: any) {
      console.error('Delete todo error:', err)
      setError(err.message || "Gagal menghapus todo")
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      category: todo.category,
      priority: todo.priority,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : undefined
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTodo(null)
    setFormData({
      title: "",
      category: "Personal",
      priority: "Medium",
    })
    setError("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Work': return 'text-purple-600 bg-purple-50'
      case 'Study': return 'text-blue-600 bg-blue-50'
      case 'Personal': return 'text-green-600 bg-green-50'
      case 'Health': return 'text-pink-600 bg-pink-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Card className="border-purple-300/40 dark:border-purple-700/40 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
      <CardHeader className="border-b-2 border-purple-300/40 dark:border-purple-700/40 pb-4">
        <CardTitle className="text-xl flex items-center justify-between text-purple-600 dark:text-purple-400">
          To Do List
          <Button
            onClick={() => setShowForm(!showForm)}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white border-0 transition-all duration-300 hover:scale-105 shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            {showForm ? 'Batal' : 'Tambah'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add/Edit Todo Form */}
        {showForm && (
          <div className="mb-4 p-4 bg-purple-50/80 dark:bg-purple-950/30 rounded-lg space-y-3 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {editingTodo ? "Edit Todo" : "Tambah Todo Baru"}
            </h3>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</Label>
              <Input
                placeholder="Apa yang mau dikerjakan?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="mt-1 border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="mt-1 w-full p-2 border border-orange-200 dark:border-orange-800 rounded-md text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Priority</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="mt-1 w-full p-2 border border-orange-200 dark:border-orange-800 rounded-md text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due Date (Optional)
              </Label>
              <Input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 border-orange-200 dark:border-orange-800 focus:border-orange-400 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <Button
              onClick={addTodo}
              className="w-full bg-pink-500 hover:bg-pink-600 transition-all duration-300 shadow-lg hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingTodo ? "Update Todo" : "Tambah Todo"}
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            {/* Todo List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">{todos.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                  <p>Belum ada task</p>
                  <p className="text-sm">Klik "Tambah" untuk membuat task baru!</p>
                </div>
              ) : (
                todos.map((todo, index) => (
                  <div
                    key={todo._id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-purple-100 dark:border-gray-600 bg-purple-50/50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 w-6 mt-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Checkbox
                        checked={todo.isCompleted}
                        onCheckedChange={() => toggleTodo(todo._id!)}
                        className="border-purple-400 data-[state=checked]:bg-purple-500 mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <span
                          className={`block ${
                            todo.isCompleted
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {todo.title}
                        </span>
                        <div className="flex flex-wrap gap-2 items-center text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${getCategoryColor(todo.category)}`}>
                            <Tag className="h-3 w-3 inline mr-1" />
                            {todo.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                          {todo.dueDate && (
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(todo.dueDate).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(todo)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo._id!)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            {todos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-gray-600">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Selesai: {todos.filter((t) => t.isCompleted).length}/{todos.length}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {Math.round((todos.filter((t) => t.isCompleted).length / todos.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-purple-100 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(todos.filter((t) => t.isCompleted).length / todos.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

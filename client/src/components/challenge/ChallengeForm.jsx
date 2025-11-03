import React, { useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ImageIcon, Link2 } from "lucide-react"

const SERVER_URI = import.meta.env.VITE_SERVER_URI || `http://localhost:3000`

export default function ChallengeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    attempts: "",
    experienceLevel: "",
    sources: "",
    imageUrl: "",
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("duration", formData.duration)
      form.append("attempts", formData.attempts)
      form.append("experienceLevel", formData.experienceLevel)
      form.append("sources", formData.sources)

      if (file) form.append("image", file)
      else if (formData.imageUrl) form.append("image", formData.imageUrl)

      const res = await axios.post(
        `${SERVER_URI}/challenges/create-challenge`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )

      setMessage(res.data.message || "Challenge created successfully!")
      setFormData({
        title: "",
        description: "",
        duration: "",
        attempts: "",
        experienceLevel: "",
        sources: "",
        imageUrl: "",
      })
      setFile(null)
      setPreview(null)

      // Trigger callback (for parent refresh or closing form)
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setMessage(
        err.response?.data?.message ||
          "Something went wrong while creating the challenge."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Create New Challenge
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter challenge title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the challenge"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Duration & Attempts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div>
              <Label htmlFor="attempts">Attempts</Label>
              <Input
                id="attempts"
                name="attempts"
                type="number"
                value={formData.attempts}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <Label htmlFor="experienceLevel">
              Experience Level (comma separated)
            </Label>
            <Input
              id="experienceLevel"
              name="experienceLevel"
              placeholder="e.g. beginner, intermediate"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Sources */}
          <div>
            <Label htmlFor="sources">Sources (comma separated)</Label>
            <Input
              id="sources"
              name="sources"
              placeholder="https://dribbble.com/example, https://figma.com/file/xyz"
              value={formData.sources}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>

          {/* Image Upload / URL */}
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 cursor-pointer"
                />
              </div>
              <span className="text-zinc-500">or</span>
              <div className="flex-1 flex items-center gap-2">
                <Link2 size={16} />
                <Input
                  type="text"
                  name="imageUrl"
                  placeholder="Paste image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              </div>
            </div>

            {/* Image Preview */}
            {preview || formData.imageUrl ? (
              <div className="mt-3">
                <img
                  src={preview || formData.imageUrl}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-lg border border-zinc-800"
                />
              </div>
            ) : (
              <div className="mt-3 h-56 border border-dashed border-zinc-700 rounded-lg flex items-center justify-center text-zinc-500">
                <ImageIcon className="mr-2" /> No image selected
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Challenge
            </Button>
          </div>

          {message && (
            <p className="text-sm text-center text-zinc-400 mt-2">{message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

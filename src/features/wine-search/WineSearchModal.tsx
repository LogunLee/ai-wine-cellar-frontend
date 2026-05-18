import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material'
import {
  Close,
  Delete,
  Edit,
  Search,
  Add,
  Image,
  ContentPaste,
} from '@mui/icons-material'
import { wineSearchApi, type WineRecognitionResult } from '../../shared/api/wineSearch'

interface WineSearchModalProps {
  open: boolean
  onClose: () => void
}

interface EditableWine extends WineRecognitionResult {
  _id: string
  _selected: boolean
  _editing: boolean
}

const WineSearchModal = ({ open, onClose }: WineSearchModalProps) => {
  const [searchText, setSearchText] = useState('')
  const [hiddenText, setHiddenText] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<EditableWine[]>([])
  const [searched, setSearched] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const blob = item.getAsFile()
        if (!blob) return

        const reader = new FileReader()
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1]
          setImage(base64)
          if (searchText) {
            setHiddenText(searchText)
            setSearchText('')
          }
        }
        reader.readAsDataURL(blob)
        break
      }
    }
  }, [searchText])

  useEffect(() => {
    if (open) {
      document.addEventListener('paste', handlePaste)
    }
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [open, handlePaste])

  useEffect(() => {
    if (!open) {
      setSearchText('')
      setHiddenText('')
      setImage(null)
      setResults([])
      setSearched(false)
      setError(null)
    }
  }, [open])

  const handleClearImage = () => {
    setImage(null)
    if (hiddenText) {
      setSearchText(hiddenText)
      setHiddenText('')
    }
  }

  const handleFind = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    setSearched(true)

    try {
      const { data } = await wineSearchApi.recognize(image)
      setResults(
        data.wines.map((w, i) => ({
          ...w,
          _id: `wine-${i}`,
          _selected: false,
          _editing: false,
        })),
      )
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка распознавания')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setResults((prev) =>
      prev.map((w) => (w._id === id ? { ...w, _selected: !w._selected } : w)),
    )
  }

  const toggleEdit = (id: string) => {
    setResults((prev) =>
      prev.map((w) => (w._id === id ? { ...w, _editing: !w._editing } : w)),
    )
  }

  const removeWine = (id: string) => {
    setResults((prev) => prev.filter((w) => w._id !== id))
  }

  const updateWine = (id: string, field: keyof WineRecognitionResult, value: unknown) => {
    setResults((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w)),
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Найти вино
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {image && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <Paper variant="outlined" sx={{ p: 1, position: 'relative', display: 'inline-block' }}>
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Wine"
                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
              />
              <IconButton
                size="small"
                onClick={handleClearImage}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Paper>
          </Box>
        )}

        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          placeholder="Опишите вино или вставьте изображение (Ctrl+V)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={!!image}
          inputRef={textareaRef}
          sx={{ mb: 2 }}
        />

        {!image && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<ContentPaste fontSize="small" />}
              label="Ctrl+V для вставки изображения"
              variant="outlined"
              size="small"
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {searched && results.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Распознанные вина ({results.length})
            </Typography>

            {results.map((wine) => (
              <Paper
                key={wine._id}
                variant="outlined"
                sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}
              >
                <Checkbox
                  checked={wine._selected}
                  onChange={() => toggleSelect(wine._id)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />

                <Box sx={{ flex: 1 }}>
                  {wine._editing ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <TextField
                        size="small"
                        label="Производитель"
                        value={wine.producer}
                        onChange={(e) => updateWine(wine._id, 'producer', e.target.value)}
                        fullWidth
                      />
                      <TextField
                        size="small"
                        label="Название"
                        value={wine.name}
                        onChange={(e) => updateWine(wine._id, 'name', e.target.value)}
                        fullWidth
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          label="Год"
                          type="number"
                          value={wine.vintageYear || ''}
                          onChange={(e) =>
                            updateWine(wine._id, 'vintageYear', e.target.value ? Number(e.target.value) : undefined)
                          }
                          sx={{ width: 100 }}
                        />
                        <TextField
                          size="small"
                          label="Регион"
                          value={wine.region || ''}
                          onChange={(e) => updateWine(wine._id, 'region', e.target.value)}
                          fullWidth
                        />
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {wine.producer} {wine.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        {wine.vintageYear && (
                          <Chip label={wine.vintageYear} size="small" variant="outlined" />
                        )}
                        {wine.region && (
                          <Chip label={wine.region} size="small" variant="outlined" />
                        )}
                        {wine.wineType && (
                          <Chip label={wine.wineType} size="small" color="primary" />
                        )}
                        <Chip
                          label={`${Math.round(wine.confidence * 100)}%`}
                          size="small"
                          color={wine.confidence > 0.8 ? 'success' : wine.confidence > 0.5 ? 'warning' : 'error'}
                        />
                      </Box>
                    </>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <IconButton size="small" onClick={() => toggleEdit(wine._id)} title="Редактировать">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => removeWine(wine._id)} title="Удалить">
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Поиск информации">
                    <Search fontSize="small" />
                  </IconButton>
                  <IconButton size="small" title="Добавить в погреб">
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </>
        )}

        {searched && results.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Вина не распознаны. Попробуйте другое изображение.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Image />}
          onClick={handleFind}
          disabled={!image || loading}
        >
          {loading ? 'Распознаю...' : 'Найти'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default WineSearchModal

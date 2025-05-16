'use client'
import React, { useState, useEffect } from 'react'

interface Props {
  videoUrl: string
}

function VideoEmbed({ videoUrl }: Props) {
  // Указываем тип состояния как string | null
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)

  useEffect(() => {
    // Функция для получения oEmbed данных
    async function fetchEmbedData() {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        videoUrl
      )}&format=json`
      try {
        const response = await fetch(oEmbedUrl)
        const data = await response.json()

        // Проверка безопасности: убедимся, что домен — youtube.com
        const iframeHtml = data.html
        const iframe = extractIframeSrc(iframeHtml)

        // Если найден iframe с доверенным источником, устанавливаем его src
        if (iframe && isValidDomain(iframe)) {
          setIframeSrc(iframe)
        } else {
          console.error('Неверный или небезопасный источник видео')
        }
      } catch (error) {
        console.error('Ошибка загрузки oEmbed данных:', error)
      }
    }

    if (videoUrl) {
      fetchEmbedData() // Загружаем oEmbed данные при изменении ссылки
    }
  }, [videoUrl])

  // Функция для извлечения src из HTML-кода iframe
  function extractIframeSrc(html: string) {
    const iframeMatch = html.match(/<iframe.*?src="(.*?)".*?>/)
    return iframeMatch ? iframeMatch[1] : null
  }

  // Функция для проверки домена (например, youtube.com)
  function isValidDomain(src: string) {
    const validDomains = ['www.youtube.com', 'www.vimeo.com'] // Добавьте другие разрешенные домены
    const url = new URL(src)
    return validDomains.includes(url.hostname)
  }

  return (
    <div className="video-embed">
      {iframeSrc ? (
        <iframe
          width="560"
          height="315"
          src={iframeSrc}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded Video"
        ></iframe>
      ) : (
        <p>Загрузка видео...</p>
      )}
    </div>
  )
}

export default VideoEmbed

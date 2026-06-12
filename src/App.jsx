import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './App.css'

const API_ROOT = (import.meta.env.VITE_API_ROOT || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const API_SITE_ROOT = (import.meta.env.VITE_API_SITE_ROOT || API_ROOT.replace(/\/api$/, '')).replace(/\/$/, '')
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://digi-news.example').replace(/\/$/, '')
const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Digi News'
const SITE_DESCRIPTION = 'Fast multilingual news coverage with article metadata, RSS feeds, sitemaps, and language alternates prepared for search and AI discovery.'
const DEFAULT_AUTHOR = 'Newsroom Staff'
const DEFAULT_PUBLISHER = SITE_NAME
const PUBLISHER_LOGO = `${SITE_URL}/favicon.svg`

const languages = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'hi', label: 'हिन्दी' },
]

const uiCopy = {
  en: {
    eyebrow: 'Daily Brief',
    title: 'Newsroom',
    search: 'Search',
    searchPlaceholder: 'Search headlines',
    latest: 'Latest',
    stories: 'stories',
    readStory: 'Read story',
    empty: 'No stories match this filter.',
    ready: 'Backend live',
    loading: 'Loading API',
    offline: 'Sample mode',
    recommended: 'Recommended for you',
    likes: 'likes',
    comments: 'comments',
    likeStory: 'Like',
    liked: 'Liked',
    liking: 'Liking…',
    commentName: 'Name',
    commentPlaceholder: 'Add a comment',
    postComment: 'Post',
    posting: 'Posting…',
    noComments: 'No comments yet.',
    categories: ['All', 'Top', 'World', 'Business', 'Tech', 'Sports', 'Culture'],
  },
  sw: {
    eyebrow: 'Muhtasari wa Leo',
    title: 'Chumba cha Habari',
    search: 'Tafuta',
    searchPlaceholder: 'Tafuta vichwa vya habari',
    latest: 'Habari Mpya',
    stories: 'habari',
    readStory: 'Soma habari',
    empty: 'Hakuna habari zinazolingana na kichujio hiki.',
    ready: 'Backend ipo',
    loading: 'Inapakia API',
    offline: 'Hali ya mfano',
    recommended: 'Mapendekezo kwako',
    likes: 'vipendwa',
    comments: 'maoni',
    likeStory: 'Penda',
    liked: 'Imependwa',
    liking: 'Inapendwa…',
    commentName: 'Jina',
    commentPlaceholder: 'Ongeza maoni',
    postComment: 'Tuma',
    posting: 'Inatuma…',
    noComments: 'Hakuna maoni bado.',
    categories: ['Zote', 'Kuu', 'Dunia', 'Biashara', 'Teknolojia', 'Michezo', 'Utamaduni'],
  },
  fr: {
    eyebrow: 'Brief du Jour',
    title: 'Rédaction',
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher des titres',
    latest: 'Dernières nouvelles',
    stories: 'articles',
    readStory: 'Lire',
    empty: 'Aucun article ne correspond à ce filtre.',
    ready: 'Backend actif',
    loading: 'Chargement API',
    offline: 'Mode exemple',
    recommended: 'Recommandé pour vous',
    likes: 'mentions',
    comments: 'commentaires',
    likeStory: 'Aimer',
    liked: 'Aimé',
    liking: 'En cours…',
    commentName: 'Nom',
    commentPlaceholder: 'Ajouter un commentaire',
    postComment: 'Publier',
    posting: 'Publication…',
    noComments: 'Aucun commentaire.',
    categories: ['Tous', 'Une', 'Monde', 'Éco', 'Tech', 'Sport', 'Culture'],
  },
  de: {
    eyebrow: 'Tagesbrief',
    title: 'Nachrichtenraum',
    search: 'Suchen',
    searchPlaceholder: 'Schlagzeilen suchen',
    latest: 'Neueste',
    stories: 'Artikel',
    readStory: 'Lesen',
    empty: 'Keine Artikel passen zu diesem Filter.',
    ready: 'Backend aktiv',
    loading: 'API lädt',
    offline: 'Beispielmodus',
    recommended: 'Empfohlen für Sie',
    likes: 'Likes',
    comments: 'Kommentare',
    likeStory: 'Liken',
    liked: 'Gemocht',
    liking: 'Wird geliked…',
    commentName: 'Name',
    commentPlaceholder: 'Kommentar schreiben',
    postComment: 'Posten',
    posting: 'Wird gepostet…',
    noComments: 'Noch keine Kommentare.',
    categories: ['Alle', 'Top', 'Welt', 'Wirtschaft', 'Tech', 'Sport', 'Kultur'],
  },
  zh: {
    eyebrow: '每日简报',
    title: '新闻编辑室',
    search: '搜索',
    searchPlaceholder: '搜索标题',
    latest: '最新',
    stories: '篇报道',
    readStory: '阅读全文',
    empty: '没有符合此筛选条件的报道。',
    ready: '后端在线',
    loading: '正在加载 API',
    offline: '示例模式',
    recommended: '为你推荐',
    likes: '赞',
    comments: '评论',
    likeStory: '点赞',
    liked: '已赞',
    liking: '正在点赞…',
    commentName: '姓名',
    commentPlaceholder: '添加评论',
    postComment: '发布',
    posting: '发布中…',
    noComments: '还没有评论。',
    categories: ['全部', '头条', '世界', '商业', '科技', '体育', '文化'],
  },
  es: {
    eyebrow: 'Resumen Diario',
    title: 'Redacción',
    search: 'Buscar',
    searchPlaceholder: 'Buscar titulares',
    latest: 'Últimas',
    stories: 'noticias',
    readStory: 'Leer noticia',
    empty: 'No hay noticias para este filtro.',
    ready: 'Backend activo',
    loading: 'Cargando API',
    offline: 'Modo ejemplo',
    recommended: 'Recomendado para ti',
    likes: 'me gusta',
    comments: 'comentarios',
    likeStory: 'Me gusta',
    liked: 'Gustado',
    liking: 'Dando me gusta…',
    commentName: 'Nombre',
    commentPlaceholder: 'Añadir comentario',
    postComment: 'Publicar',
    posting: 'Publicando…',
    noComments: 'Sin comentarios aún.',
    categories: ['Todo', 'Portada', 'Mundo', 'Negocios', 'Tech', 'Deportes', 'Cultura'],
  },
  pt: {
    eyebrow: 'Resumo Diário',
    title: 'Redação',
    search: 'Pesquisar',
    searchPlaceholder: 'Pesquisar manchetes',
    latest: 'Últimas',
    stories: 'notícias',
    readStory: 'Ler notícia',
    empty: 'Nenhuma notícia corresponde a este filtro.',
    ready: 'Backend ativo',
    loading: 'Carregando API',
    offline: 'Modo exemplo',
    recommended: 'Recomendado para você',
    likes: 'curtidas',
    comments: 'comentários',
    likeStory: 'Curtir',
    liked: 'Curtido',
    liking: 'Curtindo…',
    commentName: 'Nome',
    commentPlaceholder: 'Adicionar comentário',
    postComment: 'Publicar',
    posting: 'Publicando…',
    noComments: 'Ainda sem comentários.',
    categories: ['Tudo', 'Destaques', 'Mundo', 'Negócios', 'Tech', 'Esportes', 'Cultura'],
  },
  hi: {
    eyebrow: 'दैनिक संक्षेप',
    title: 'न्यूज़रूम',
    search: 'खोजें',
    searchPlaceholder: 'शीर्षक खोजें',
    latest: 'नवीनतम',
    stories: 'समाचार',
    readStory: 'समाचार पढ़ें',
    empty: 'इस फ़िल्टर से कोई समाचार मेल नहीं खाता।',
    ready: 'बैकएंड लाइव',
    loading: 'API लोड हो रहा है',
    offline: 'नमूना मोड',
    recommended: 'आपके लिए सुझाव',
    likes: 'पसंद',
    comments: 'टिप्पणियां',
    likeStory: 'पसंद करें',
    liked: 'पसंद किया',
    liking: 'पसंद कर रहे हैं…',
    commentName: 'नाम',
    commentPlaceholder: 'टिप्पणी जोड़ें',
    postComment: 'पोस्ट करें',
    posting: 'पोस्ट किया जा रहा है…',
    noComments: 'अभी कोई टिप्पणी नहीं।',
    categories: ['सभी', 'मुख्य', 'दुनिया', 'व्यापार', 'टेक', 'खेल', 'संस्कृति'],
  },
}

const categoryIds = ['all', 'top', 'world', 'business', 'technology', 'sports', 'culture']

const fallbackStory = {
  en: ['County health teams expand mobile clinics', 'New routes will bring weekly primary care visits to remote communities.', 'County health officials announced an expanded mobile clinic schedule focused on preventive care, maternal health, and routine screenings.'],
  sw: ['Timu za afya za kaunti zapanua kliniki za rununu', 'Njia mpya zitaleta huduma za msingi kila wiki kwa jamii za mbali.', 'Maafisa wa afya wa kaunti wametangaza ratiba pana ya kliniki za rununu inayolenga kinga, afya ya mama, na uchunguzi wa kawaida.'],
  fr: ['Les équipes de santé du comté développent les cliniques mobiles', 'De nouveaux trajets apporteront des soins primaires hebdomadaires aux communautés éloignées.', 'Les responsables de la santé ont annoncé un calendrier élargi de cliniques mobiles axé sur la prévention, la santé maternelle et les contrôles de routine.'],
  de: ['Gesundheitsteams erweitern mobile Kliniken', 'Neue Routen bringen wöchentliche Grundversorgung in abgelegene Gemeinden.', 'Gesundheitsbehörden kündigten einen erweiterten Plan für mobile Kliniken mit Fokus auf Vorsorge, Muttergesundheit und Routineuntersuchungen an.'],
  zh: ['县卫生团队扩大流动诊所服务', '新路线将每周为偏远社区提供基础医疗服务。', '县卫生官员宣布扩大流动诊所安排，重点关注预防护理、孕产妇健康和常规筛查。'],
  es: ['Equipos de salud amplían clínicas móviles', 'Nuevas rutas llevarán atención primaria semanal a comunidades remotas.', 'Las autoridades de salud anunciaron un calendario ampliado de clínicas móviles centrado en prevención, salud materna y controles de rutina.'],
  pt: ['Equipes de saúde ampliam clínicas móveis', 'Novas rotas levarão cuidados primários semanais a comunidades remotas.', 'Autoridades de saúde anunciaram um calendário ampliado de clínicas móveis com foco em prevenção, saúde materna e exames de rotina.'],
  hi: ['काउंटी स्वास्थ्य दल मोबाइल क्लिनिक बढ़ा रहे हैं', 'नए मार्ग दूरस्थ समुदायों तक साप्ताहिक प्राथमिक स्वास्थ्य सेवा पहुंचाएंगे।', 'काउंटी स्वास्थ्य अधिकारियों ने निवारक देखभाल, मातृ स्वास्थ्य और नियमित जांच पर केंद्रित मोबाइल क्लिनिक कार्यक्रम के विस्तार की घोषणा की।'],
}

function buildCategories(language) {
  return categoryIds.map((id, index) => ({ id, label: uiCopy[language].categories[index] }))
}

function buildFallbackArticles(language) {
  const story = fallbackStory[language]
  return [
    {
      id: 'sample-1',
      slug: 'county-health-teams-expand-mobile-clinics',
      title: story[0],
      summary: story[1],
      body: story[2],
      category: 'top',
      source: 'Metro Desk',
      author: 'Newsroom Staff',
      imageUrl: 'https://images.unsplash.com/photo-1587502536263-9298f4ef8c9e?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      engagement: { likes: 0, commentCount: 0, comments: [] },
      publishedAt: new Date().toISOString(),
    },
  ]
}

function getPathLanguage() {
  const pathLanguage = window.location.pathname.split('/').filter(Boolean)[0]
  return languages.some((language) => language.code === pathLanguage) ? pathLanguage : null
}

function getPathSlug() {
  const [, section, slug] = window.location.pathname.split('/').filter(Boolean)
  return section === 'news' ? slug : null
}

function normalizeLanguageCode(value) {
  return value?.toLowerCase().split('-')[0]
}

function isSupportedLanguage(value) {
  return languages.some((language) => language.code === value)
}

function getSavedLanguage() {
  const savedLanguage = localStorage.getItem('news-language')
  return isSupportedLanguage(savedLanguage) ? savedLanguage : null
}

function getBrowserLanguage() {
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language]
  return browserLanguages.map(normalizeLanguageCode).find(isSupportedLanguage) || null
}

function getInitialLanguage() {
  return getPathLanguage() || getSavedLanguage() || getBrowserLanguage() || 'en'
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem('news-theme')
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function formatDate(value, language) {
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function getArticlePath(article, language) {
  return `/${language}/news/${article.slug || article.id}/`
}

function getArticleApiUrl(article, language, segment) {
  return `${API_ROOT}/${language}/articles/${article.slug || article.id}/${segment}/`
}

function getAbsoluteArticleUrl(article, language) {
  return `${SITE_URL}${getArticlePath(article, language)}`
}

function getCategoryPath(category, language) {
  return `/${language}/${category}/`
}

function getSearchUrl(query, language) {
  const searchValue = query === '{search_term_string}' ? query : encodeURIComponent(query || '')
  return `${SITE_URL}/${language}/search?q=${searchValue}`
}

function getAuthorSlug(author = DEFAULT_AUTHOR) {
  return author.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getAuthorUrl(author, language) {
  return `${SITE_URL}/${language}/authors/${getAuthorSlug(author)}/`
}

function getOptimizedImageUrl(imageUrl, width, format = 'webp') {
  if (!imageUrl) {
    return ''
  }

  try {
    const url = new URL(imageUrl)
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', '82')
    url.searchParams.set('fm', format)
    return url.toString()
  } catch {
    return imageUrl
  }
}

function getArticleKeywords(article) {
  return [article.category, article.source, ...(article.tags || [])].filter(Boolean).join(', ')
}

function getArticleTopics(article) {
  return [article.category, article.source, article.author, ...(article.tags || [])].filter(Boolean)
}

function getImageAlt(article) {
  return article.imageAlt || article.title
}

function formatHealthTime(value, language) {
  if (!value) {
    return 'Not available'
  }

  return formatDate(value, language)
}

function normalizeEngagement(article) {
  return {
    likes: article?.engagement?.likes ?? article?.likes ?? 0,
    commentCount: article?.engagement?.commentCount ?? article?.commentCount ?? (article?.engagement?.comments?.length ?? 0),
    comments: article?.engagement?.comments ?? [],
  }
}

function mergeEngagement(payload, previous = { likes: 0, commentCount: 0, comments: [] }) {
  const comments = Array.isArray(payload.comments) ? payload.comments : previous.comments
  const commentCount = typeof payload.commentCount === 'number'
    ? payload.commentCount
    : comments.length || previous.commentCount

  return {
    likes: typeof payload.likes === 'number' ? payload.likes : previous.likes,
    commentCount,
    comments,
  }
}

function App() {
  const initialLanguage = getInitialLanguage()
  const [language, setLanguage] = useState(initialLanguage)
  const [articles, setArticles] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('loading')
  const [siteHealth, setSiteHealth] = useState({
    status: 'checking',
    articleCount: 0,
    featuredCount: 0,
    latestPublishedAt: null,
    checkedAt: null,
  })
  const [theme, setTheme] = useState(getInitialTheme)
  const [engagement, setEngagement] = useState({ likes: 0, commentCount: 0, comments: [] })
  const [engagementStatus, setEngagementStatus] = useState('idle')
  const [engagementMessage, setEngagementMessage] = useState('')
  const [likedArticles, setLikedArticles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('news-liked-articles') || '[]') || []
    } catch {
      return []
    }
  })
  const [commentName, setCommentName] = useState('')
  const [commentBody, setCommentBody] = useState('')

  useEffect(() => {
    if (!getPathLanguage()) {
      window.history.replaceState({}, '', `/${language}`)
    }
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('news-theme', theme)
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('news-liked-articles', JSON.stringify(likedArticles))
    } catch {
      // ignore storage failures
    }
  }, [likedArticles])

  function applyLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    localStorage.setItem('news-language', nextLanguage)
    setStatus('loading')
    setActiveCategory('all')
    setQuery('')
  }

  function changeLanguage(nextLanguage) {
    applyLanguage(nextLanguage)
    const currentArticle = articles.find((article) => article.id === selectedId)
    window.history.pushState({}, '', currentArticle ? getArticlePath(currentArticle, nextLanguage) : `/${nextLanguage}`)
  }

  function selectArticle(article, shouldPush = true) {
    setSelectedId(article.id)
    if (shouldPush) {
      window.history.pushState({}, '', getArticlePath(article, language))
    }
  }

  function openArticle(article, event) {
    if (event) {
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
      if (isModifiedClick) {
        return
      }
      event.preventDefault()
    }

    selectArticle(article)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const onPopState = () => {
      const nextLanguage = getPathLanguage() || getSavedLanguage() || getBrowserLanguage() || 'en'
      applyLanguage(nextLanguage)
      const slug = getPathSlug()
      if (slug) {
        const article = articles.find((item) => item.slug === slug || String(item.id) === slug)
        if (article) {
          setSelectedId(article.id)
        }
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [articles])

  useEffect(() => {
    const controller = new AbortController()

    async function loadArticles() {
      try {
        const response = await fetch(`${API_ROOT}/${language}/articles/`, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Backend returned an error')
        }
        const data = await response.json()
        const nextArticles = data.articles || []
        const pathSlug = getPathSlug()
        const pathArticle = nextArticles.find((article) => article.slug === pathSlug || String(article.id) === pathSlug)
        setArticles(nextArticles)
        setSelectedId((pathArticle || nextArticles[0])?.id || null)
        setStatus('ready')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setArticles([])
          setSelectedId(null)
          setStatus('offline')
        }
      }
    }

    loadArticles()
    return () => controller.abort()
  }, [language])

  useEffect(() => {
    const controller = new AbortController()

    async function loadSiteHealth() {
      setSiteHealth((currentHealth) => ({ ...currentHealth, status: 'checking' }))

      try {
        const response = await fetch(`${API_ROOT}/health/?language=${language}`, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Health endpoint returned an error')
        }

        const health = await response.json()
        setSiteHealth({
          status: health.status === 'ok' ? 'healthy' : 'degraded',
          articleCount: health.articleCount ?? articles.length,
          featuredCount: health.featuredCount ?? articles.filter((article) => article.isFeatured).length,
          latestPublishedAt: health.latestPublishedAt,
          checkedAt: health.checkedAt || new Date().toISOString(),
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSiteHealth({
            status: 'offline',
            articleCount: articles.length,
            featuredCount: articles.filter((article) => article.isFeatured).length,
            latestPublishedAt: articles[0]?.publishedAt,
            checkedAt: new Date().toISOString(),
          })
        }
      }
    }

    loadSiteHealth()
    return () => controller.abort()
  }, [articles, language])

  const copy = uiCopy[language]
  const categories = buildCategories(language)

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory
      const searchable = `${article.title} ${article.summary} ${article.source}`.toLowerCase()
      return matchesCategory && searchable.includes(query.toLowerCase())
    })
  }, [activeCategory, articles, query])

  const featuredArticle = filteredArticles.find((article) => article.isFeatured) || filteredArticles[0]
  const selectedArticle =
    articles.find((article) => article.id === selectedId) || featuredArticle || articles[0]
  useEffect(() => {
    if (!selectedArticle) {
      return
    }

    const controller = new AbortController()
    setEngagement(normalizeEngagement(selectedArticle))
    setEngagementStatus('loading')
    setEngagementMessage('')

    async function loadEngagement() {
      try {
        const response = await fetch(getArticleApiUrl(selectedArticle, language, 'engagement'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Engagement endpoint returned an error')
        }

        const payload = await response.json()
        setEngagement(mergeEngagement(payload, normalizeEngagement(selectedArticle)))
        setEngagementStatus('idle')
        setEngagementMessage('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setEngagementStatus('offline')
          setEngagementMessage('Unable to load likes and comments. Try again later.')
        }
      }
    }

    loadEngagement()
    return () => controller.abort()
  }, [language, selectedArticle])

  const recommendedArticles = selectedArticle
    ? articles
        .filter((article) => article.id !== selectedArticle.id)
        .sort((firstArticle, secondArticle) => {
          const firstScore = firstArticle.category === selectedArticle.category ? 0 : 1
          const secondScore = secondArticle.category === selectedArticle.category ? 0 : 1
          return firstScore - secondScore
        })
        .slice(0, 3)
    : []
  const canonicalUrl = selectedArticle ? getAbsoluteArticleUrl(selectedArticle, language) : `${SITE_URL}/${language}`
  const articleDescription = selectedArticle?.summary || copy.empty
  const articleTitle = selectedArticle ? `${selectedArticle.title} | ${SITE_NAME}` : SITE_NAME
  const selectedAuthor = selectedArticle?.author || DEFAULT_AUTHOR
  const selectedCategory = selectedArticle?.category || 'top'
  const selectedImage = selectedArticle?.imageUrl || featuredArticle?.imageUrl
  const selectedImageWebp = getOptimizedImageUrl(selectedImage, 1200, 'webp')
  const selectedImageAvif = getOptimizedImageUrl(selectedImage, 1200, 'avif')
  const selectedImageUrl = selectedImageWebp || selectedImage || PUBLISHER_LOGO
  const selectedImageAlt = selectedArticle ? getImageAlt(selectedArticle) : SITE_NAME
  const selectedModifiedAt = selectedArticle?.updatedAt || selectedArticle?.publishedAt
  const footerCategories = categories.filter((category) => category.id !== 'all').slice(0, 4)
  const publisherSchema = {
    '@type': 'NewsMediaOrganization',
    name: DEFAULT_PUBLISHER,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: PUBLISHER_LOGO,
    },
  }
  const healthLabel = siteHealth.status === 'healthy'
    ? 'All systems normal'
    : siteHealth.status === 'checking'
      ? 'Checking site health'
      : siteHealth.status === 'offline'
        ? 'API unavailable'
        : 'Service degraded'
  const searchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: languages.map((item) => item.code),
    publisher: publisherSchema,
    potentialAction: {
      '@type': 'SearchAction',
      target: getSearchUrl('{search_term_string}', language),
      'query-input': 'required name=search_term_string',
    },
  }
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: DEFAULT_PUBLISHER,
    url: SITE_URL,
    logo: PUBLISHER_LOGO,
    description: SITE_DESCRIPTION,
    publishingPrinciples: `${SITE_URL}/llms.txt`,
    knowsAbout: ['breaking news', 'world news', 'business news', 'technology news', 'sports news', 'culture news', 'multilingual journalism'],
  }
  const articleSchema = selectedArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        headline: selectedArticle.title,
        description: articleDescription,
        articleSection: selectedCategory,
        keywords: getArticleKeywords(selectedArticle),
        about: getArticleTopics(selectedArticle).map((topic) => ({ '@type': 'Thing', name: topic })),
        inLanguage: language,
        isAccessibleForFree: true,
        image: [selectedImageAvif, selectedImageWebp, selectedImage].filter(Boolean),
        datePublished: selectedArticle.publishedAt,
        dateModified: selectedModifiedAt,
        wordCount: selectedArticle.body?.split(/\s+/).filter(Boolean).length,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.story-detail h2', '.story-detail p'],
        },
        author: {
          '@type': 'Person',
          name: selectedAuthor,
          url: getAuthorUrl(selectedAuthor, language),
        },
        publisher: publisherSchema,
      }
    : null
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${copy.latest} - ${SITE_NAME}`,
    description: articleDescription,
    inLanguage: language,
    numberOfItems: filteredArticles.length,
    itemListElement: filteredArticles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getAbsoluteArticleUrl(article, language),
      item: {
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.summary,
        url: getAbsoluteArticleUrl(article, language),
        datePublished: article.publishedAt,
        articleSection: article.category,
        inLanguage: language,
        author: {
          '@type': 'Person',
          name: article.author || DEFAULT_AUTHOR,
        },
        publisher: publisherSchema,
      },
    })),
  }
  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: categories.map((category) => category.label),
    url: categories.map((category) => `${SITE_URL}${getCategoryPath(category.id, language)}`),
  }
  const breadcrumbSchema = selectedArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${language}` },
          { '@type': 'ListItem', position: 2, name: selectedCategory, item: `${SITE_URL}${getCategoryPath(selectedCategory, language)}` },
          { '@type': 'ListItem', position: 3, name: selectedArticle.title, item: canonicalUrl },
        ],
      }
    : null

  function applyEngagement(payload) {
    const nextEngagement = mergeEngagement(payload, engagement)
    setEngagement(nextEngagement)
    setArticles((currentArticles) => currentArticles.map((article) => (
      article.id === (payload.articleId || selectedArticle?.id)
        ? { ...article, engagement: nextEngagement, likes: nextEngagement.likes, commentCount: nextEngagement.commentCount }
        : article
    )))
  }

  async function likeSelectedArticle() {
    if (!selectedArticle || engagementStatus === 'liking') {
      return
    }

    const alreadyLiked = likedArticles.includes(selectedArticle.id)
    if (alreadyLiked) {
      setEngagementMessage('You already liked this story.')
      return
    }

    setEngagementStatus('liking')
    setEngagementMessage('')

    try {
      const response = await fetch(getArticleApiUrl(selectedArticle, language, 'likes'), { method: 'POST' })
      if (!response.ok) {
        throw new Error('Like endpoint returned an error')
      }
      const payload = await response.json()
      applyEngagement(payload)
      setLikedArticles((current) => Array.from(new Set([...current, selectedArticle.id])))
      setEngagementStatus('idle')
      setEngagementMessage('')
    } catch {
      setEngagementStatus('offline')
      setEngagementMessage('Unable to save your like. Please try again later.')
    }
  }

  async function submitComment(event) {
    event.preventDefault()
    if (!selectedArticle || !commentBody.trim() || engagementStatus === 'commenting') {
      return
    }

    setEngagementStatus('commenting')
    setEngagementMessage('')
    const displayName = commentName.trim() || 'Anonymous'
    const body = commentBody.trim()

    try {
      const response = await fetch(getArticleApiUrl(selectedArticle, language, 'comments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          body,
        }),
      })
      if (!response.ok) {
        throw new Error('Comment endpoint returned an error')
      }
      const payload = await response.json()
      applyEngagement(payload)
      setCommentName('')
      setCommentBody('')
      setEngagementStatus('idle')
      setEngagementMessage('')
    } catch {
      setEngagementStatus('offline')
      setEngagementMessage('Unable to post your comment. Please try again later.')
    }
  }

  return (
    <main className="app-shell">
      <Helmet>
        <html lang={language} />
        <title>{articleTitle}</title>
        <meta name="description" content={articleDescription} />
        <meta name="author" content={selectedAuthor} />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="news_keywords" content={selectedArticle ? getArticleKeywords(selectedArticle) : 'news, latest news'} />
        <meta name="keywords" content={selectedArticle ? getArticleKeywords(selectedArticle) : 'news, multilingual news, latest news'} />
        <meta name="ai-summary" content={articleDescription} />
        <meta name="citation_title" content={selectedArticle?.title || SITE_NAME} />
        <meta name="citation_publication_date" content={selectedArticle?.publishedAt || siteHealth.latestPublishedAt || ''} />
        <meta name="citation_author" content={selectedAuthor} />
        <meta name="citation_language" content={language} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-image-preview:large" />
        <meta name="bingbot" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content={theme === 'dark' ? '#101216' : '#f6f7f9'} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="author" href={getAuthorUrl(selectedAuthor, language)} />
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href={`${API_SITE_ROOT}/rss/?language=${language}`} />
        {/* sitemap links removed for deployed frontend */}
        <link rel="help" type="text/plain" href={`${SITE_URL}/llms.txt`} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {languages.map((item) => (
          <link
            key={item.code}
            rel="alternate"
            hrefLang={item.code}
            href={selectedArticle ? getAbsoluteArticleUrl(selectedArticle, item.code) : `${SITE_URL}/${item.code}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={selectedArticle ? getAbsoluteArticleUrl(selectedArticle, 'en') : `${SITE_URL}/en`} />
        <meta property="og:type" content={selectedArticle ? 'article' : 'website'} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={selectedArticle?.title || SITE_NAME} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:image" content={selectedImageUrl} />
        <meta property="og:image:alt" content={selectedImageAlt} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={language} />
        {languages.filter((item) => item.code !== language).map((item) => (
          <meta key={item.code} property="og:locale:alternate" content={item.code} />
        ))}
        <meta property="article:section" content={selectedCategory} />
        <meta property="article:author" content={getAuthorUrl(selectedAuthor, language)} />
        {getArticleTopics(selectedArticle || {}).map((topic) => (
          <meta key={topic} property="article:tag" content={topic} />
        ))}
        {selectedArticle?.publishedAt && <meta property="article:published_time" content={selectedArticle.publishedAt} />}
        {selectedModifiedAt && <meta property="article:modified_time" content={selectedModifiedAt} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={selectedArticle?.title || SITE_NAME} />
        <meta name="twitter:description" content={articleDescription} />
        <meta name="twitter:image" content={selectedImageUrl} />
        <meta name="twitter:image:alt" content={selectedImageAlt} />
        <script type="application/ld+json">{JSON.stringify(searchSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(navigationSchema)}</script>
        {articleSchema && <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
      </Helmet>
      <header className="topbar">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className="topbar-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-knob" />
            </span>
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <label className="language-select">
            <span>Language</span>
            <select
              value={language}
              aria-label="Select language"
              onChange={(event) => changeLanguage(event.target.value)}
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {/* status pill removed for deployment-ready UI */}
        </div>
      </header>

      {selectedArticle && (
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <a href={`/${language}`}>Home</a>
          <a href={getCategoryPath(selectedCategory, language)}>{selectedCategory}</a>
          <span aria-current="page">{selectedArticle.title}</span>
        </nav>
      )}

      <section className="controls" aria-label="News filters">
        <div className="category-tabs">
          {categories.map((category, index) => {
            const href = category.id === 'all' ? `/${language}` : getCategoryPath(category.id, language)
            return (
              <a
                key={category.id}
                href={href}
                className={activeCategory === category.id ? 'active' : ''}
                style={{ '--tab-index': index }}
                onClick={(event) => {
                  const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
                  if (isModifiedClick) {
                    return
                  }
                  event.preventDefault()
                  setActiveCategory(category.id)
                  setQuery('')
                  window.history.pushState({}, '', href)
                }}
              >
                {category.label}
              </a>
            )
          })}
        </div>
        <label className="search-box">
          <span>{copy.search}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </label>
      </section>

      <section className="lead-grid">
        <main className="story-detail" aria-live="polite" key={selectedArticle?.id} itemScope itemType="https://schema.org/NewsArticle">
          {/* Top meta: category / author / date-time */}
          {selectedArticle && (
            <p className="meta story-meta">
              <a href={getCategoryPath(selectedCategory, language)}>{selectedCategory}</a> /{' '}
              <a href={`/${language}/authors/${getAuthorSlug(selectedAuthor)}/`}>{selectedAuthor}</a> ·{' '}
              <time dateTime={selectedArticle.publishedAt}>{formatDate(selectedArticle.publishedAt, language)}</time>
            </p>
          )}

          {/* Headline */}
          <h1 itemProp="headline">{selectedArticle?.title}</h1>

          {/* Article image */}
          {selectedArticle && (
            <img
              src={selectedImageUrl}
              alt={selectedImageAlt}
              className="story-image"
              itemProp="image"
            />
          )}

          {/* Full body */}
          <div className="story-body" itemProp="articleBody">
            <p>{selectedArticle?.body}</p>
          </div>

          {/* Article trust / metadata (updated) */}
          {selectedArticle && (
            <div className="article-trust">
              <span>By {selectedAuthor}</span>
              {selectedModifiedAt && (
                <time dateTime={selectedModifiedAt}>Updated {formatDate(selectedModifiedAt, language)}</time>
              )}
            </div>
          )}

          {/* Engagement row + comments */}
          {selectedArticle && (
            <section className="engagement-panel" aria-label="Article engagement">
              <div className="engagement-summary engagement-row">
                <span>{engagement.likes} {copy.likes}</span>
                <span>{engagement.commentCount} {copy.comments}</span>
                <button
                  type="button"
                  onClick={likeSelectedArticle}
                  disabled={engagementStatus === 'liking' || likedArticles.includes(selectedArticle.id)}
                >
                  {likedArticles.includes(selectedArticle.id)
                    ? copy.liked
                    : engagementStatus === 'liking'
                      ? copy.liking
                      : copy.likeStory}
                </button>
              </div>
              {engagementMessage && (
                <div className="engagement-feedback" aria-live="polite">
                  {engagementMessage}
                </div>
              )}

              <form className="comment-form" onSubmit={submitComment}>
                <input
                  type="text"
                  value={commentName}
                  onChange={(event) => setCommentName(event.target.value)}
                  placeholder={copy.commentName}
                  maxLength="80"
                />
                <textarea
                  value={commentBody}
                  onChange={(event) => setCommentBody(event.target.value)}
                  placeholder={copy.commentPlaceholder}
                  maxLength="1200"
                  rows="3"
                />
                <button
                  type="submit"
                  disabled={!commentBody.trim() || engagementStatus === 'commenting'}
                >
                  {engagementStatus === 'commenting' ? copy.posting : copy.postComment}
                </button>
              </form>

              <div className="comment-list">
                {engagement.comments.length > 0 ? engagement.comments.slice().reverse().map((comment, index) => (
                  <article key={comment.id || `${comment.displayName}-${index}` } className="comment-item">
                    <strong>{comment.displayName || 'Anonymous'}</strong>
                    <p>{comment.body}</p>
                  </article>
                )) : (
                  <p className="comment-empty">{copy.noComments}</p>
                )}
              </div>
            </section>
          )}

          {recommendedArticles.length > 0 && (
            <div className="recommendations">
              <h3>{copy.recommended}</h3>
              <div className="recommendation-list">
                {recommendedArticles.map((article, index) => (
                  <a
                    key={article.id}
                    href={getArticlePath(article, language)}
                    className="recommendation-card"
                    style={{ '--card-index': index }}
                    onClick={(event) => openArticle(article, event)}
                  >
                    <span className="meta">{article.source || article.category}</span>
                    <strong>{article.title}</strong>
                  </a>
                ))}
              </div>
            </div>
          )}
        </main>
      </section>

      <section className="latest-section">
        <div className="section-heading">
          <h2>{copy.latest}</h2>
          <span>
            {filteredArticles.length} {copy.stories}
          </span>
        </div>
        <div className="article-list">
          {filteredArticles.map((article, index) => (
            <a
              key={article.id}
              href={getArticlePath(article, language)}
              className={`article-card ${selectedArticle?.id === article.id ? 'selected' : ''}`}
              style={{ '--card-index': index }}
              onClick={(event) => openArticle(article, event)}
            >
              <picture>
                <source srcSet={getOptimizedImageUrl(article.imageUrl, 700, 'avif')} type="image/avif" />
                <source srcSet={getOptimizedImageUrl(article.imageUrl, 700, 'webp')} type="image/webp" />
                <img src={article.imageUrl} alt={getImageAlt(article)} loading="lazy" />
              </picture>
              <span className="meta">{article.source || article.category}</span>
              <strong>{article.title}</strong>
              <span>{article.summary}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <p className="eyebrow">{SITE_NAME}</p>
          <h2>Independent digital reporting, tuned for every reader.</h2>
          <p>
            Follow the latest updates by section, language, or feed. The newsroom keeps article
            metadata, language alternates, RSS, and sitemaps ready for discovery.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer sections">
          <div>
            <h3>Sections</h3>
            {footerCategories.map((category) => (
              <a key={category.id} href={getCategoryPath(category.id, language)}>
                {category.label}
              </a>
            ))}
          </div>
          <div>
            <h3>Publishing</h3>
            <a href={`/${language}`}>Home</a>
            <a href={`${API_SITE_ROOT}/rss/?language=${language}`}>RSS feed</a>
            {/* sitemap links removed for frontend deployment */}
          </div>
        </nav>
        <div className="footer-legal">
          <small>
            © {new Date().getFullYear()} {SITE_NAME} · <a href={`${API_SITE_ROOT}/rss/?language=${language}`}>RSS</a> · <a href="/privacy">Privacy</a>
          </small>
        </div>
      </footer>
    </main>
  )
}

export default App

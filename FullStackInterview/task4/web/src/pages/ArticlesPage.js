// web/src/pages/ArticlesPage/ArticlesPage.js

// 模拟数据（实际项目通过GraphQL获取）
const mockArticles = [
  {
    id: 1,
    title: '示例文章标题',
    content: '这里是文章内容摘要，演示数据展示效果...',
    url: 'https://example.com',
    createdAt: new Date().toISOString()
  }
]

// 组件状态处理
const DataState = ({ loading, error, children }) => {
  if (loading) return (
    <div className="flex justify-center py-12">
      <svg className="animate-spin h-8 w-8 text-blue-500" 
           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
  )

  if (error) return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
      数据加载失败: {error.message}
    </div>
  )

  return children
}

const ArticleCard = ({ article }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
    <p className="text-gray-600 line-clamp-3 mb-4">{article.content}</p>
    <div className="flex justify-between items-center text-sm">
      <a href={article.url} 
         target="_blank" 
         rel="noopener noreferrer"
         className="text-blue-600 hover:underline">
        查看原文 →
      </a>
      <span className="text-gray-500">
        {new Date(article.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
)

const ArticlesPage = () => {
  const [dataState, setDataState] = useState({
    loading: true,
    error: null,
    data: []
  })

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      try {
        // 实际项目中替换为真实数据获取
        setDataState({
          loading: false,
          error: null,
          data: mockArticles
        })
      } catch (error) {
        setDataState({
          loading: false,
          error, 
          data: []
        })
      }
    }, 1500)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">抓取内容展示</h1>
        <p className="text-gray-500 mt-2">最新数据更新于：{new Date().toLocaleDateString()}</p>
      </header>

      <DataState {...dataState}>
        {dataState.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无可用数据
          </div>
        ) : (
          dataState.data.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </DataState>
    </div>
  )
}

export default ArticlesPage

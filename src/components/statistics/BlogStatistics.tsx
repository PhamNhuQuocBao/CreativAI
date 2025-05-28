import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { statisticsService } from '@/services/statistics.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const BlogStatistics = () => {
  // Fetch data using React Query
  const { data: postsOverTime } = useQuery({
    queryKey: ['postsOverTime'],
    queryFn: () => statisticsService.getPostsOverTime(),
  })

  const { data: commentsPerPost } = useQuery({
    queryKey: ['commentsPerPost'],
    queryFn: () => statisticsService.getCommentsPerPost(),
  })

  const { data: reactionDistribution } = useQuery({
    queryKey: ['reactionDistribution'],
    queryFn: () => statisticsService.getReactionDistribution(),
  })

  const { data: interactionsOverTime } = useQuery({
    queryKey: ['interactionsOverTime'],
    queryFn: () => statisticsService.getInteractionsOverTime(),
  })

  const { data: topEngagedPosts } = useQuery({
    queryKey: ['topEngagedPosts'],
    queryFn: () => statisticsService.getTopEngagedPosts(),
  })

  // Format data for charts
  const formattedPostsOverTime = postsOverTime?.map((item) => ({
    date: format(
      new Date(item._id.year, item._id.month - 1, item._id.day || 1),
      'MMM dd'
    ),
    posts: item.count,
  }))

  const formattedInteractionsOverTime = interactionsOverTime?.map((item) => ({
    date: format(
      new Date(item._id.year, item._id.month - 1, item._id.day || 1),
      'MMM dd'
    ),
    interactions: item.totalInteractions,
  }))

  const reactionData = reactionDistribution
    ? [
        { name: 'Like', value: reactionDistribution.like },
        { name: 'Love', value: reactionDistribution.love },
        { name: 'Wow', value: reactionDistribution.wow },
        { name: 'Angry', value: reactionDistribution.angry },
        { name: 'Dislike', value: reactionDistribution.dislike },
      ]
    : []

  return (
    <div className=" mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Blog Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Posts Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedPostsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="posts" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comments per Post */}
        <Card>
          <CardHeader>
            <CardTitle>Comments per Post</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commentsPerPost}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="blogTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="commentCount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reaction Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Reaction Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reactionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {reactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total Interactions Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Total Interactions Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedInteractionsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Engaged Posts */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Engaged Posts</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEngagedPosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEngagement" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BlogStatistics

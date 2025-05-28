'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  MessageSquare,
  ThumbsUp,
  Eye,
  MessageCircle,
  Heart,
} from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

const DashboardPage = () => {
  const { data: overview } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => dashboardService.getOverview(),
  })

  const { data: recentPosts } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => dashboardService.getRecentPosts(),
  })

  const { data: recentActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => dashboardService.getRecentActivities(),
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalPosts || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalComments || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reactions
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalReactions || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalViews || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts?.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell>
                      <Link
                        href={`/blog/${post._id}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {post.commentCount}
                        <ThumbsUp className="h-4 w-4 ml-2" />
                        {post.totalReactions}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities?.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center gap-4 text-sm"
                >
                  {activity.type === 'comment' ? (
                    <MessageCircle className="h-4 w-4" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{activity.userName}</span>{' '}
                      {activity.type === 'comment'
                        ? 'commented on'
                        : 'reacted to'}{' '}
                      <Link
                        href={`/blog/${activity.blogId}`}
                        className="font-medium hover:underline"
                      >
                        {activity.blogTitle}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(activity.createdAt),
                        'MMM dd, yyyy HH:mm'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage

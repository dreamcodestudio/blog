'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { gsap } from 'gsap'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { Post } from '@/lib/posts'

interface PostClientProps {
  post: Post
}

export default function PostClient({ post }: PostClientProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out"
        }
      )

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.2
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    return `${time} min read`
  }

  // Convert markdown to HTML (basic implementation)
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4 text-cyberpunk-white font-cyber">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-cyberpunk-white font-cyber">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4 text-cyberpunk-yellow font-cyber">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyberpunk-yellow">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-cyberpunk-white">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-cyberpunk-yellow/20 text-cyberpunk-yellow px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-cyberpunk-white/90">')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-cyberpunk-white/90">$1</li>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4 text-cyberpunk-white/90">$1</li>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6 w-full border border-cyberpunk-yellow/30" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyberpunk-yellow hover:underline hover:text-cyberpunk-white transition-colors">$1</a>')
  }

  const breadcrumbItems = [
    { label: 'Posts', href: '/posts' },
    { label: post.frontmatter.title }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-cyberpunk-base">
      {/* Header */}
      <div ref={headerRef} className="bg-gradient-to-r from-cyberpunk-yellow/10 via-cyberpunk-yellow/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={breadcrumbItems} />

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-cyberpunk-yellow mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.frontmatter.date}>
                {formatDate(post.frontmatter.date)}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(post.content)}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyberpunk-yellow font-cyber">
            {post.frontmatter.title}
          </h1>

          {/* Tags */}
          {post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-cyberpunk-yellow/10 text-cyberpunk-yellow rounded-full border border-cyberpunk-yellow/30"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Button */}
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.frontmatter.title,
                  url: window.location.href
                })
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyberpunk-yellow/20 hover:bg-cyberpunk-yellow/30 text-cyberpunk-yellow rounded-lg transition-colors border border-cyberpunk-yellow/50"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg prose-invert max-w-none">
          <div 
            className="leading-relaxed text-cyberpunk-white/90 [&>p]:mb-4 [&>p]:text-cyberpunk-white/90 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-cyberpunk-yellow [&>h1]:font-cyber [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-cyberpunk-white [&>h2]:font-cyber [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-cyberpunk-white [&>h3]:font-cyber [&>ul]:my-4 [&>ul]:ml-6 [&>li]:mb-2 [&>li]:text-cyberpunk-white/90 [&>code]:bg-cyberpunk-yellow/20 [&>code]:text-cyberpunk-yellow [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>img]:rounded-lg [&>img]:my-6 [&>img]:border [&>img]:border-cyberpunk-yellow/30 [&>a]:text-cyberpunk-yellow [&>a]:hover:underline [&>a]:hover:text-cyberpunk-white [&>a]:transition-colors"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-cyberpunk-yellow/20">
          <div className="flex justify-between items-center">
            <Link 
              href="/posts"
              className="inline-flex items-center gap-2 px-4 py-2 cyber-panel rounded-lg hover:bg-cyberpunk-yellow/10 transition-colors text-cyberpunk-white hover:text-cyberpunk-yellow"
            >
              <ArrowLeft className="w-4 h-4" />
              All Posts
            </Link>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyberpunk-yellow text-black rounded-lg hover:bg-cyberpunk-white transition-colors font-tech font-bold"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
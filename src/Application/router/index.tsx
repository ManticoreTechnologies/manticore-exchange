{
  path: '/blog',
  element: <BlogPage />,
  children: [
    {
      path: ':slug',
      element: <BlogPage />
    }
  ]
} 
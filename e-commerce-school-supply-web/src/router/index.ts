import { createRouter, createWebHistory } from 'vue-router'

const route = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutUsView.vue'),

  },
  {
      path: '/contact',
      name: 'Contact us',
      component: () => import('../views/ContactView.vue')
    },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/auth/SigninPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/auth/SignupPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('../views/auth/ForgetPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/verify',
    name: 'verify',
    component: () => import('../views/auth/VerifyPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import('../views/auth/ResetPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/product-list',
    name: 'Product List',
    component: () => import('../views/products/ProductListView.vue'),
    alias: ['/products'],
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('../views/products/ProductDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/profile/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin Dashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideLayout: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/cart/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/checkoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('../views/orders/OrderDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'my-orders',
    component: () => import('../views/orders/MyOrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reviews',
    name: 'my-reviews',
    component: () => import('../views/orders/MyReviewsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'my-favorites',
    component: () => import('../views/favorites/MyFavoritesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: route,
})

// Navigation guard to check authentication and authorization
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('accessToken')
  const guestMode = sessionStorage.getItem('guestMode')
  const isAuthenticated = !!token
  
  // Parse user object from sessionStorage to get role
  let userRole = null
  const userString = sessionStorage.getItem('user')
  if (userString) {
    try {
      const user = JSON.parse(userString)
      userRole = user.role // Extract role from user object
    } catch (e) {
      console.error('Failed to parse user from sessionStorage', e)
    }
  }

  // If user is authenticated and is ADMIN
  if (isAuthenticated && userRole === 'ADMIN') {
    // Only allow access to admin routes
    if (to.meta.requiresAdmin) {
      next()
    } else {
      // Redirect to admin dashboard for all non-admin routes
      next({ name: 'Admin Dashboard' })
    }
  }
  // If route requires admin access and user is not admin
  else if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      next({ name: 'signin' })
    } else {
      // Non-admin users cannot access /admin, redirect to home
      next({ name: 'home' })
    }
  }
  // If route requires auth and user is not authenticated
  else if (to.meta.requiresAuth && !isAuthenticated) {
    // Allow home page and product list access for guests
    if ((to.name === 'home' || to.name === 'Product List') && guestMode === 'true') {
      next()
    } else {
      next({ name: 'signin' })
    }
  }
  // If route is for guests only (signin/signup) and user is authenticated, redirect to home
  else if (to.meta.guest && isAuthenticated) {
    next({ name: 'home' })
  }
  // Otherwise, allow navigation
  else {
    next()
  }
})

// Scroll to top on every route change (instant, no animation)
router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })
})

export default router

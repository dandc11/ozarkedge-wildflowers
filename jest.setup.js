import '@testing-library/jest-dom'

// Mock stegaClean to identity to avoid potential heavy processing / env issues
jest.mock('@sanity/client/stega', () => ({
  stegaClean: (v) => v,
}))

// Lightweight mock for next/image to avoid internal Next.js optimizations in tests
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return ({ src = '', alt = '', ...rest }) => <img src={src} alt={alt} {...rest} />
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn(),
  }),
  usePathname: () => '/mock-path',
  notFound: jest.fn(),
}))

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => (fn) => {
  const DynamicComponent = (props) => {
    const Component = fn()
    return <Component {...props} />
  }
  DynamicComponent.displayName = 'DynamicComponent'
  return DynamicComponent
})

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window-dependent APIs only in jsdom environment
if (typeof window !== 'undefined') {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock scrollTo
  global.scrollTo = jest.fn()
}

// Mock console methods for cleaner test output
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Warning: React does not recognize') ||
        args[0].includes('Warning: Received `true` for a non-boolean attribute') ||
        args[0].includes('Warning: An update to ForwardRef inside a test was not wrapped in act') ||
        args[0].includes('Image is missing required "src" property') ||
        args[0].includes('Warning: An update to ForwardRef'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

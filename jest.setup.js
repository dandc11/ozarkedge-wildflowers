import '@testing-library/jest-dom'

// Mock stegaClean to identity to avoid potential heavy processing / env issues
jest.mock('@sanity/client/stega', () => ({
  stegaClean: (v) => v,
}))

// Lightweight mock for next/image to avoid internal Next.js optimizations in tests
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name, @next/next/no-img-element
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
// Handles both synchronous factories and factories that return a Promise (from import())
jest.mock('next/dynamic', () => (importer /*, options*/) => {
  const path = require('path')
  const DynamicComponent = (props) => {
    try {
      const modOrComp = importer()
      // If the factory returns a Promise (from import()), try to synchronously resolve common local modules
      if (modOrComp && typeof modOrComp.then === 'function') {
        // Attempt to extract the import path from the importer source
        const src = importer.toString()
        const match = src.match(/import\((['"])\.?\.\/([^'"\)]+)\1\)/)
        if (match) {
          // Map relative path to project root assuming component collocation
          const relFile = match[2]
          const abs = path.join(process.cwd(), 'components', relFile)
          // eslint-disable-next-line global-require, import/no-dynamic-require
          const required = require(abs)
          const C = required.default || required
          return C ? <C {...props} /> : null
        }
        // Special-case fallback for lightbox dynamic usage
        try {
          const { SlideshowLightbox } = require('lightbox.js-react')
          return <SlideshowLightbox {...props} />
        } catch (e) {
          return null
        }
      }
      const Component = modOrComp?.default || modOrComp
      return Component ? <Component {...props} /> : null
    } catch (e) {
      return null
    }
  }
  DynamicComponent.displayName = 'DynamicComponent'
  return DynamicComponent
})

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    // eslint-disable-next-line @next/next/no-img-element
    img: ({ children, alt = '', ...props }) => (
      <img alt={alt} {...props}>
        {children}
      </img>
    ),
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

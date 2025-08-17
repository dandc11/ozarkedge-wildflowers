/**
 * @jest-environment node
 */

import { getImagePalette, getImagePaletteBackgroundColor } from './imageUtil'

describe('imageUtil.js', () => {
  // Mock image data with various palette types
  const mockImageWithFullPalette = {
    palette: {
      darkMuted: {
        background: '#2C3E50',
        foreground: '#FFFFFF',
        population: 1145,
        title: '#FFFFFF',
      },
      darkVibrant: {
        background: '#8E44AD',
        foreground: '#FFFFFF',
        population: 967,
        title: '#FFFFFF',
      },
      dominant: {
        background: '#3498DB',
        foreground: '#FFFFFF',
        population: 1876,
        title: '#FFFFFF',
      },
      lightMuted: {
        background: '#BDC3C7',
        foreground: '#2C3E50',
        population: 743,
        title: '#2C3E50',
      },
      lightVibrant: {
        background: '#F39C12',
        foreground: '#2C3E50',
        population: 532,
        title: '#2C3E50',
      },
      vibrant: {
        background: '#E74C3C',
        foreground: '#FFFFFF',
        population: 1298,
        title: '#FFFFFF',
      },
      muted: {
        background: '#95A5A6',
        foreground: '#2C3E50',
        population: 834,
        title: '#2C3E50',
      },
    },
  }

  const mockImageWithPartialPalette = {
    palette: {
      dominant: {
        background: '#27AE60',
        foreground: '#FFFFFF',
        population: 1456,
        title: '#FFFFFF',
      },
      vibrant: {
        background: '#E67E22',
        foreground: '#FFFFFF',
        population: 892,
        title: '#FFFFFF',
      },
      // Missing other palette types
    },
  }

  const mockImageWithNoPalette = {
    // Image without palette property
  }

  const defaultPalette = {
    background: '#f34b3c',
    foreground: '#fff',
    population: 1292,
    title: '#fff',
  }

  describe('getImagePalette', () => {
    describe('with full palette data', () => {
      it('returns darkMuted palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'darkMuted')
        expect(result).toEqual({
          background: '#2C3E50',
          foreground: '#FFFFFF',
          population: 1145,
          title: '#FFFFFF',
        })
      })

      it('returns darkVibrant palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'darkVibrant')
        expect(result).toEqual({
          background: '#8E44AD',
          foreground: '#FFFFFF',
          population: 967,
          title: '#FFFFFF',
        })
      })

      it('returns dominant palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'dominant')
        expect(result).toEqual({
          background: '#3498DB',
          foreground: '#FFFFFF',
          population: 1876,
          title: '#FFFFFF',
        })
      })

      it('returns lightMuted palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'lightMuted')
        expect(result).toEqual({
          background: '#BDC3C7',
          foreground: '#2C3E50',
          population: 743,
          title: '#2C3E50',
        })
      })

      it('returns lightVibrant palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'lightVibrant')
        expect(result).toEqual({
          background: '#F39C12',
          foreground: '#2C3E50',
          population: 532,
          title: '#2C3E50',
        })
      })

      it('returns vibrant palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'vibrant')
        expect(result).toEqual({
          background: '#E74C3C',
          foreground: '#FFFFFF',
          population: 1298,
          title: '#FFFFFF',
        })
      })

      it('returns muted palette when available', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'muted')
        expect(result).toEqual({
          background: '#95A5A6',
          foreground: '#2C3E50',
          population: 834,
          title: '#2C3E50',
        })
      })
    })

    describe('with partial palette data', () => {
      it('returns available palette type', () => {
        const result = getImagePalette(mockImageWithPartialPalette, 'dominant')
        expect(result).toEqual({
          background: '#27AE60',
          foreground: '#FFFFFF',
          population: 1456,
          title: '#FFFFFF',
        })
      })

      it('returns default palette when requested type is not available', () => {
        const result = getImagePalette(mockImageWithPartialPalette, 'darkMuted')
        expect(result).toEqual(defaultPalette)
      })

      it('returns default palette when requested type is lightVibrant (not available)', () => {
        const result = getImagePalette(mockImageWithPartialPalette, 'lightVibrant')
        expect(result).toEqual(defaultPalette)
      })
    })

    describe('with no palette data', () => {
      it('returns default palette when image has no palette property', () => {
        const result = getImagePalette(mockImageWithNoPalette, 'dominant')
        expect(result).toEqual(defaultPalette)
      })

      it('returns default palette for any palette type when no palette exists', () => {
        const result = getImagePalette(mockImageWithNoPalette, 'vibrant')
        expect(result).toEqual(defaultPalette)
      })
    })

    describe('edge cases', () => {
      it('returns default palette for unknown palette type', () => {
        const result = getImagePalette(mockImageWithFullPalette, 'unknownType')
        expect(result).toEqual(defaultPalette)
      })

      it('returns default palette for empty string palette type', () => {
        const result = getImagePalette(mockImageWithFullPalette, '')
        expect(result).toEqual(defaultPalette)
      })

      it('returns default palette for null palette type', () => {
        const result = getImagePalette(mockImageWithFullPalette, null)
        expect(result).toEqual(defaultPalette)
      })

      it('returns default palette for undefined palette type', () => {
        const result = getImagePalette(mockImageWithFullPalette, undefined)
        expect(result).toEqual(defaultPalette)
      })

      it('handles null image gracefully', () => {
        const result = getImagePalette(null, 'dominant')
        expect(result).toEqual(defaultPalette)
      })

      it('handles undefined image gracefully', () => {
        const result = getImagePalette(undefined, 'dominant')
        expect(result).toEqual(defaultPalette)
      })
    })
  })

  describe('getImagePaletteBackgroundColor', () => {
    describe('with valid palette data', () => {
      it('returns correct background color for dominant palette', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithFullPalette, 'dominant')
        expect(result).toBe('#3498DB')
      })

      it('returns correct background color for vibrant palette', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithFullPalette, 'vibrant')
        expect(result).toBe('#E74C3C')
      })

      it('returns correct background color for darkMuted palette', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithFullPalette, 'darkMuted')
        expect(result).toBe('#2C3E50')
      })

      it('returns correct background color for lightVibrant palette', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithFullPalette, 'lightVibrant')
        expect(result).toBe('#F39C12')
      })
    })

    describe('with partial palette data', () => {
      it('returns available palette background color', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithPartialPalette, 'vibrant')
        expect(result).toBe('#E67E22')
      })

      it('returns default background color when palette type not available', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithPartialPalette, 'lightMuted')
        expect(result).toBe('#f34b3c')
      })
    })

    describe('with no palette data', () => {
      it('returns default background color when no palette exists', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithNoPalette, 'dominant')
        expect(result).toBe('#f34b3c')
      })
    })

    describe('edge cases', () => {
      it('returns default background color for unknown palette type', () => {
        const result = getImagePaletteBackgroundColor(mockImageWithFullPalette, 'invalidType')
        expect(result).toBe('#f34b3c')
      })

      it('handles null image gracefully', () => {
        const result = getImagePaletteBackgroundColor(null, 'dominant')
        expect(result).toBe('#f34b3c')
      })

      it('handles undefined parameters gracefully', () => {
        const result = getImagePaletteBackgroundColor(undefined, undefined)
        expect(result).toBe('#f34b3c')
      })
    })
  })
})

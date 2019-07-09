import React, { Fragment, FC, useRef, useEffect } from 'react'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
//@ts-ignore
import styles from './styles.css'
import { path } from 'ramda'

enum POSITIONS {
  BOTTOM = 'BOTTOM',
}

interface Props {
  position?: POSITIONS
}

interface StorefrontComponent extends FC<Props & BlockClass> {
  schema?: any
}

const StickyLayoutComponent: StorefrontComponent = ({
  children,
  position,
  blockClass,
}) => {
  const container = useRef<HTMLDivElement>(null)
  const startTop = useRef<number | null>(null)
  const hasTouched = useRef<boolean>(false)

  if (position !== POSITIONS.BOTTOM) {
    // Only 'BOTTOM' position supported for now!
    return null
  }

  const handleScroll = () => {
    if (!container.current) {
      return
    }
    if (startTop.current == null) {
      startTop.current = container.current.offsetTop
    }
    const newTop =
      window.innerHeight -
      startTop.current -
      container.current.clientHeight +
      window.pageYOffset

    if (newTop < 0) {
      hasTouched.current = true
      container.current.style.transform = `translateY(${newTop}px)`
      return
    }
    if (newTop >= 0) {
      // Reset and don't change anything
      container.current.style.transform = `translateY(0px)`
    }
  }

  useEffect(() => {
    window && window.addEventListener('scroll', handleScroll)
    return () => {
      window && window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const viewOffset = path<number>(['current', 'offsetTop'], container)
  useEffect(() => {
    if (viewOffset != null && !hasTouched.current) {
      startTop.current = viewOffset
      handleScroll()
    }
  }, [viewOffset])

  return (
    <Fragment>
      <div
        ref={container}
        className={generateBlockClass(styles.container, blockClass)}
        style={{
          position: 'relative',
          bottom: 0,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </Fragment>
  )
}

export default StickyLayoutComponent

import React from 'react'

const Footer = (props) => {
  return (
    <footer id="oeFooter" className={`footer flex`}>
      <p className={`copyright fs-xs`}>
        © Copyright {new Date().getFullYear()}. Ozarkedge Wildflowers
      </p>
    </footer>
  )
}

export default Footer

'use client'

const Footer = () => {
  return (
    <footer className="bg-black text-white px-4 py-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold">Stockers</h2>
          <p className="text-xs text-white/80">Smart data & insights for investors.</p>
        </div>
        <div className="text-xs text-center">
          <p>Email: support@stockers.ai</p>
          <p>Phone: +62 812-3456-7890</p>
        </div>
      </div>
      <div className="text-center mt-4 text-white/60 text-xs">
        © {new Date().getFullYear()} Stockers. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

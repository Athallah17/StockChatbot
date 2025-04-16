'use client'

const Footer = () => {
  return (
    <footer className="bg-[#0E6EFF] text-white px-6 md:px-12 lg:px-12 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Stockers</h2>
          <p className="text-sm text-white/80">Empowering investors with smart data & insights.</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Contact</p>
          <p>Email: support@stockers.ai</p>
          <p>Phone: +62 812-3456-7890</p>
        </div>
      </div>
      <div className="text-center mt-8 text-white/60 text-sm">
        © {new Date().getFullYear()} Stockers. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

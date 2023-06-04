import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <main className='flex flex-col justify-center items-center min-h-screen w-full bg-zinc-50'>
      <Component {...pageProps} />
    </main>
  )
}

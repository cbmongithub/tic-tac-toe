import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <main className='flex flex-col justify-center items-center min-h-screen w-full'>
      <Component {...pageProps} />
    </main>
  )
}

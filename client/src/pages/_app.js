import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <main className='flex flex-col justify-center items-center min-h-screen w-full bg-zinc-50'>
      <div className='flex-flex-row justify-center items-center bg-blue-500 text-white text-center py-5 w-full fixed top-0'>
        <h1 className='text-2xl font-bold'>Tic Tac Toe</h1>
      </div>
      <Component {...pageProps} />
    </main>
  )
}

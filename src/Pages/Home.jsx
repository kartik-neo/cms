import React from 'react'
import Dashboard from './Dashboard'
// import PostEventAnalysis from './codeBlue/PostEventAnalysis'
// import PostEventAnalysis from './codeBlack/PostEventAnalysis'
// import PostEventAnalysisAllCodes from '../Components/Common/PostEventAnalysis';

const Home = () => {

  return (
    <div className='flex flex-col items-center justify-center w-full py-2'>
      {/* <p className='mt-10'>Home Page</p>
       <PostEventAnalysisAllCodes  codeType="pink"/> */}
       <Dashboard/>
    </div>
  )
}

export default Home
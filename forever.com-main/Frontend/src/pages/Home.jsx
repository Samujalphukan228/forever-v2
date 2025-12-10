import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import NewaLetterBox from '../components/NewaLetterBox'
import OurPolicy from '../components/OurPolicy'
import BrandStory from '../components/BrandStory'

const Home = () => {
  return (
    <div>
      <Hero/>
      <BrandStory/> 
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewaLetterBox/>
    </div>
  )
}

export default Home
import styled from "styled-components";
import Layout from "../components/layout";

//#region -> styled
const LandingPage = styled("div")`
  height: 80vh;
  text-align: center;
  img {
    width: 100px;
    padding-top: 20vh;
  }
  h1 {
    color: #fff;
    font-size: 2rem;
  }
`
//#endregion

const Home = () => {
  return (
    <Layout>
      <LandingPage>
        <img src="./images/Royal_Thai_Navy.svg" />
        <h1>ระบบข้อมูลความสัมพันธ์ระหว่างประเทศ</h1>
      </LandingPage>
    </Layout>
  )
}

export default Home
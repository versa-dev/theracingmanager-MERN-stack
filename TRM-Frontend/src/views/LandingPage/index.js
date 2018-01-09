/**
 *  @module react
 */
import React, { Component } from 'react'

import ViewHeaderBar from 'components/common/ViewHeaderBar'

import TitleDescriptionSection from 'components/common/TitleDescriptionSection'

import { Link } from 'react-router-dom'

import TextButton from 'components/buttons/TextButton'

import google from 'assets/landing/google.png'

import apple from 'assets/landing/apple-app-store-icon.png'

import phone from 'assets/landing/updatesonthetrot.png'

import LandingPageForm from 'containers/LandingPageForm'

import {
  CardView,
  SpecCardFrame,
  CardContent
} from 'components/cards/FeaturedCard'

class LandingPage extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <div className="landing-page">
        <ViewHeaderBar
          title={`Welcome back *firstname`} />
        <div className="landing-page-header-section">
          <div className="landing-page-header" style={{ backgroundImage: `url(/assets/images/wave.svg)` }}>
            <div className="container">
              <TitleDescriptionSection
                title="What's the news?"
                titleModifier='h1'
                colorModifier='blue' >
                <TextButton
                  text="Get informed"
                  className="landing-page__button"
                  onClick={() => {}}/>
              </TitleDescriptionSection>
            </div>
          </div>
        </div>
        <div className="landing-page-link-section container">
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Browse horses"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/browse-horses'>
                    <TextButton
                      text='BROWSE'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="List a horse"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/'>
                    <TextButton
                      text='LIST NOW'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Register a syndicate"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/syndicate/new'>
                    <TextButton
                      text='REGISTER NOW'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Code of conduct"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/legal/conduct'>
                    <TextButton
                      text='READ IN FULL'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="My horses"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/dashboard'>
                    <TextButton
                      text='VIEW HORSES'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Personal verification"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/account/verification'>
                    <TextButton
                      text='START NOW'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Racing news"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/news'>
                    <TextButton
                      text='START SEARCHING'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Vat & invoicing"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/vat'>
                    <TextButton
                      text='MORE DETAILS'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
          <CardView>
            <SpecCardFrame>
              <CardContent>
                <TitleDescriptionSection
                  title="Faqs"
                  titleModifier='h2'
                  colorModifier='blue' >
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer<br />
                    adipiscing elit, sed diam nonummy nibh euismod<br />
                    tincidunt ut laoreet dolore magnavolutpat.
                  </p>
                  <Link to='/faqs'>
                    <TextButton
                      text='TROUBLE SHOOT'
                      modifier='secondary'
                      className='landing-page__more-btn'
                      onClick={() => {}}
                    />
                  </Link>
                </TitleDescriptionSection>
              </CardContent>
            </SpecCardFrame>
          </CardView>
        </div>
        <div className="landing-page-social-section">
          <div className="landing-page-social-bg" style={{ backgroundImage: `url(/assets/images/wave-blue.svg)` }}>
            <div className="container">
              <TitleDescriptionSection
                title="Updates on the trot"
                titleModifier='h1'
                colorModifier='blue' >
                <p>
                  Download The Racing Manager app now, lorem ipsum dolor sit amet,
                  consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt
                  ut laoreet dolore magna aliquam erat volutpat, Ut wisi enim ad minim.
                </p>
              </TitleDescriptionSection>
            </div>
          </div>
          <div className="image-section">
            <div className="container">
              <img className="google-image" src={google} />
              <img className="apple-image" src={apple} />
            </div>
            <img className="phone-image" src={phone} />
          </div>
        </div>
        <div className="landing-page-footer-section">
          <div className="container">
            <div className="section-left">
              <TitleDescriptionSection
                title="Need support?"
                titleModifier='h1'
                colorModifier='blue' >
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                  nonummy nibh euismod tincidunt ut laoreet dolore magana aliquam erat
                  volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tatioin
                  ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                </p>
              </TitleDescriptionSection>
              <TextButton
                text='CHECK OUR FAQS'
                modifier='secondary'
                className='member-dashboard__more-btn'
                onClick={() => {}}
              />
              <div className="social-icons">
                <i className="fa fa-phone" aria-hidden="true"><p className="number">020 000 00000</p><p className="period">mon-fri 9:00-19:00</p></i>
                <i className="fa fa-facebook" aria-hidden="true"><p className="title">/TheRacingManager</p></i>
                <i className="fa fa-twitter" aria-hidden="true"><p className="title">@TheRacingManager</p></i>
                <i className="fa fa-linkedin-square" aria-hidden="true"><p className="title">TheRacingManager</p></i>
              </div>
            </div>
            <div className="section-right">
              <LandingPageForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage

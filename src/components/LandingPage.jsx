import React, { Component } from 'react';
import './LandingPage.css';
import Features from './Features';
import StepsSection from './StepsSection';
import logoImage from '../Assets/Eleanor-removebg-preview (1).png';
import Footer from './Footer.jsx';
export default class LandingPage extends Component {
  render() {
    return (
    <div>
      <div className="bg-gradient">
        <header className="header">
          <div className="header-container">
            <div className="header-content">
              <div className="header-logo">
                <a href="/" title="" className="flex">
                  <img className="w-auto h-8" src={logoImage} alt="" />
                </a>
              </div>
              <div className="nav-links">
                <a href="/home" title="" className="nav-link"> Transcirbe </a>
                <a href="/trim" title="" className="nav-link"> Trim </a>
                <a href="/add-sound" title="" className="nav-link"> Sound </a>
              </div>
            </div>
          </div>
        </header>

        <section className="section">
          <div className="section-container">
            <div className="grid">
              <div>
                <h1 className="heading">
                Transcribe,<mark> Enhance </mark>Audio, and<mark> Trim</mark>Videos 
                <mark>Effortlessly!</mark>
                </h1>

                <p className="subheading">Transform Your Media: Transcribe, Edit, and Perfect Your Videos All in One Place!.</p>

                <div className="buttons-container">
                  <a href="/home" title="" className="explore-button" role="button"> Start exploring </a>
  
                </div>
              </div>

              <div>
                <img className="image-container" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" alt="" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
      <Features />
      <StepsSection/>
      <Footer />
      </div>
      </div>
    );
  }
}

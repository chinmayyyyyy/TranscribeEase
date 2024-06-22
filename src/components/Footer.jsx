import React from 'react';
import './Footer.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    TranscribeEase
                </div>
                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/services">Services</a>
                    <a href="/contact">Contact</a>
                </div>
                <div className="footer-social">
                    <a href="https://twitter.com">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://facebook.com">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://instagram.com">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://linkedin.com">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                </div>
            </div>
            <div className="footer-copyright">
                © 2024 TranscribeEase. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;

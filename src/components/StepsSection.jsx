import React from 'react';
import './StepsSection.css'; // Import your CSS file

const StepsSection = () => {
    return (
        <section className="steps-section">
            <div className="steps-container">
                <div className="steps-text-center">
                    <h2 className="steps-heading">How does it work?</h2>
                    <p className="steps-subtitle">Follow these simple steps to get your audio transcribed quickly and accurately.</p>
                </div>

                <div className="steps-grid">
                    <div className="steps-curved-line">
                        <img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" alt="Curved Dotted Line" />
                    </div>

                    <div className="step-item">
                        <div className="step-number">
                            <span>1</span>
                        </div>
                        <h3 className="step-title">Upload Your Audio</h3>
                        <p className="step-description">Simply upload your Video files to our platform. We support a variety of file formats for your convenience.</p>
                    </div>

                    <div className="step-item">
                        <div className="step-number">
                            <span>2</span>
                        </div>
                        <h3 className="step-title">Choose Your Service</h3>
                        <p className="step-description">Select the transcription service that best suits your needs. Whether you need a single speaker or dual speaker, we've got you covered.</p>
                    </div>

                    <div className="step-item">
                        <div className="step-number">
                            <span>3</span>
                        </div>
                        <h3 className="step-title">Receive Your Transcript</h3>
                        <p className="step-description">Choose the font's and styles to the text , And jus click on Upload you will get the transcibed video in 30 Seconds.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StepsSection;

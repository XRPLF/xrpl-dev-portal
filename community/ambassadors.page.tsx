import * as React from 'react';
import { useThemeHooks } from '@redocly/theme/core/hooks';

export const frontmatter = {
  seo: {
    title: 'Ambassadors',
    description: "The XRPL Campus Ambassador program connects and empowers student champions of the XRPL.",
  }
};

false

const target= {prefix: ''}; // TODO: fixme

export default function Ambassadors() {
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();

  return (
    <div className="landing page-ambassadors">
      <div>
    <div className="position-relative d-none-sm">
        <img alt="background purple waves" src={require("../static/img/backgrounds/ambassador-purple.svg")} className="position-absolute" style={{top: 0, right: 0}} />
    </div>
    <section className="container-new py-26 text-lg-center">
        <div className="p-0 col-lg-8 mx-lg-auto">
            <div className="d-flex flex-column-reverse">
                <h1 className="mb-0">{translate("Become an XRP Ledger Campus Ambassador")}</h1>
                <h6 className="eyebrow mb-3">{translate("Join the Student Cohort")}</h6>
            </div>
            <p className="mt-3 py-3 col-lg-8 mx-lg-auto p-0">{translate("The XRPL Campus Ambassador program engages, supports, connects, and recognizes a group of student champions of the XRPL and empowers them to further advance engagement on the ledger.")}</p>
            <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
        </div>
    </section>
    {/* Current Students */}
    <section className="container-new py-26">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div className="order-lg-2 mx-lg-4 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 pr-lg-5">
                <div className="d-flex flex-column-reverse p-lg-3">
                    <h3 className="h4 h2-sm">{translate("XRPL Campus Ambassadors")}</h3>
                    <h6 className="eyebrow mb-3">{translate("Current Students")}</h6>
                </div>
                <p className="p-lg-3 mb-2 longform">{translate("The XRPL Campus Ambassador program aims to elevate the impact of college students who are passionate about blockchain technology. In their role, Campus Ambassadors help educate other students about crypto and how to start building on the XRPL.")}</p>
                <div className="d-none d-lg-block p-lg-3">
                <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
                </div>
            </div>
            <div className="order-lg-1 col-lg-6 px-0 mr-lg-4">
                <div className="row m-0">
                    <img alt="Person speaking and person taking photo" src={require("../static/img/ambassadors/developer-hero@2x.png")} className="w-100" />
                </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3 p-lg-3">
              <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
            </div>
        </div>  
    </section>
    {/* Benefits */}
    <section className="container-new py-26">
        {/* flex. Col for mobile. Row for large. on large align content to the center  */}
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div className="order-1 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
                <div className="d-flex flex-column-reverse p-lg-3">
                    <h3 className="h4 h2-sm">{translate("Why become an XRPL Campus Ambassador?")}</h3>
                    <h6 className="eyebrow mb-3">{translate("Benefits")}</h6>
                </div>
                <p className="p-lg-3 mb-2 longform">{translate("Join a global cohort of students empowering others to build on the XRPL.")}</p>
            </div>
            <div className="order-2 col-lg-6 px-0 mr-lg-5">
                <div className="row align-items-center m-0" id="benefits-list"> 
                    {/* benefitslist */}
                    <div className="col-12 col-lg-6 p-0 pr-lg-4">
                        <div className="px-lg-3 pb-3">
                            <img alt="Smiley face" id="benefits-01" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Exclusive Opportunities")}</h6>
                                <p>{translate("Get access and invitations to Ambassador-only events, conferences, and opportunities")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none ">
                            <img alt="Book" id="benefits-02" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Education")}</h6>
                                <p>{translate("Tutorials and workshops from leading XRPL and blockchain developers")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3">
                            <img alt="Gift" id="benefits-03" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Swag")}</h6>
                                <p>{translate("New XRPL swag for Ambassadors and swag to share with other students")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none">
                            <img alt="Medallion" id="benefits-04" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Mentorship")}</h6>
                                <p>{translate("Serve as an advocate and receive support from notable members of the community")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3">
                            <img alt="Up Arrow" id="benefits-05" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Career Acceleration")}</h6>
                                <p className="pb-lg-0">{translate("Gain hands-on experience building communities and grow your professional network in the blockchain industry")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none">
                            <img alt="Dollar Sign" id="benefits-06" className="pl-lg-3" />
                            <div className="pb-lg-0">
                                <h6 className="mb-3">{translate("Stipend")}</h6>
                                <p className="pb-lg-0">{translate("Receive a stipend to fund your ideas and initiatives that fuel XRPL growth on your campus")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 1 */}
                    {/* Show on large */}
                    <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block">
                        <div className="px-lg-3 pb-3 pt-5 mt-5">
                            <img alt="Book" id="benefits-02" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Education")}</h6>
                                <p>{translate("Tutorials and workshops from leading XRPL and blockchain developers")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3 ">
                            <img alt="Medallion" id="benefits-04" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Mentorship")}</h6>
                                <p>{translate("Serve as an advocate and receive support from notable members of the community")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3">
                            <img alt="Dollar Sign" id="benefits-06" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Stipend")}</h6>
                                <p className="pb-lg-0">{translate("Receive a stipend to fund your ideas and initiatives that fuel XRPL growth on your campus")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 2 */}
                </div>
            </div>
        </div>
    </section>
    {/* Eligibility */}
    <section className="container-new py-26">
        {/* flex. Col for mobile. Row for large. on large align content to the center  */}
        <div className="d-flex flex-column flex-lg-row align-items-lg-center mr-lg-4">
            <div className="order-1 order-lg-2  mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0 mr-lg-5">
                <div className="d-flex flex-column-reverse p-lg-3">
                    <h3 className="h4 h2-sm">{translate("Should You Apply?")}</h3>
                    <h6 className="eyebrow mb-3">{translate("Eligibility for XRPL Campus Ambassadors")}</h6>
                </div>
                <p className="p-lg-3 mb-2 longform">{translate("Students currently enrolled in an undergraduate or postgraduate program at an accredited college or university are eligible to apply.")}</p>
            </div>
            <div className="order-2 order-lg-1 col-lg-6 px-0">
                <div className="row align-items-center m-0" id="eligibility-list">
                    <div className="col-12 col-lg-6 p-0 pr-lg-4">
                        <div className="px-lg-3 pb-3">
                            <img alt="Calendar" id="eligibility-01" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("A Leader")}</h6>
                                <p>{translate("Interested in leading meetups and workshops for your local campus community")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none ">
                            <img alt="Book" id="eligibility-02" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Active")}</h6>
                                <p>{translate("An active participant in the XRPL community or interested in blockchain and crypto technologies")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3">
                            <img alt="CPU" id="eligibility-03" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Curious")}</h6>
                                <p>{translate("Eager to learn more about technical blockchain topics and the XRPL")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none">
                            <img alt="Quote Bubble" id="eligibility-04" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Passionate")}</h6>
                                <p>{translate("Passionate about increasing XRPL education and awareness through events, content, and classroom engagement")}</p>
                            </div>
                        </div>
                        <div className="p-lg-3 pb-3">
                            <img alt="People" id="eligibility-05" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Creative")}</h6>
                                <p className="pb-lg-0 mb-0">{translate("Ability to think outside the box to grow the XRPL student community")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 1 */}
                    {/* Show on large */}
                    <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block">
                        <div className="px-lg-3 pb-3 ">
                            <img alt="Book" id="eligibility-02" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Active")}</h6>
                                <p>{translate("An active participant in the XRPL community or interested in blockchain and crypto technologies")} </p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3 ">
                            <img alt="Quote Bubble" id="eligibility-04" className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Passionate")}</h6>
                                <p> {translate("Passionate about increasing XRPL education and awareness through events, content, and classroom engagement")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 2 */}
                </div>
            </div>
        </div>
    </section>
    {/* Current Students */}
    <section className="container-new py-26">
        {/* Quotes */}
        <div id="carouselSlidesOnly" className="carousel slide col-lg-10 mx-auto px-0" data-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <div className="p-0">
                        <div className="mb-4 p-lg-3">
                            <img alt="I have learned so much through creating programs and connecting with the XRPL community. Im truly grateful for everyone's support along the way and for the opportunity to gain so much knowledge from this expierence" src={require("../static/img/ambassadors/quote1-small.svg")} className="h-100 d-lg-none mb-4" />
                            <img alt="I have learned so much through creating programs and connecting with the XRPL community. Im truly grateful for everyone's support along the way and for the opportunity to gain so much knowledge from this expierence" src={require("../static/img/ambassadors/quote1.svg")} className="h-100 d-none d-lg-block" />
                            <div className="p-0 col-lg-7 mx-lg-auto">
                                <p className="p-lg-3 mb-2"><strong>Derrick N.</strong><br />
                                    Toronto Metropolitan University<br />
                                    Spring 2023 XRPL Campus Ambassador</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="carousel-item mb-20">
                    <div className="p-0">
                        <div className="mb-4 p-lg-3">
                            <img alt="The XRPL Campus Ambassador program really helped broaden my view of the blockchain industry with their learning resource and virtual community. Being an ambassador allowed me to meet industry professionals and likeminded peers which have given me invaluable experiences and insights." src={require("../static/img/ambassadors/quote2-small.svg")} className="h-150 d-lg-none  mb-4" />
                            <img alt="The XRPL Campus Ambassador program really helped broaden my view of the blockchain industry with their learning resource and virtual community. Being an ambassador allowed me to meet industry professionals and likeminded peers which have given me invaluable experiences and insights." src={require("../static/img/ambassadors/quote2.svg")} className="h-100 d-none d-lg-block" />
                            <div className="p-0 col-lg-7 mx-lg-auto">
                                <p className="p-lg-3 mb-2"><strong>Sally Z.</strong><br />
                                    Toronto Metropolitan University<br />
                                    Spring 2023 XRPL Campus Ambassador</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="carousel-item mb-40">
                    <div className="p-0">
                        <div className="mb-4 p-lg-3">
                            <img alt="Ive had the pleasure over the course of this program to speak with amazing individuals, I encourage you all to reach out to other people in this program and make as many connections as you can. You will quickly find out that by speaking with other people in this cohort you can learn just about anything if you ask the right people." src={require("../static/img/ambassadors/quote3-small.svg")} className="h-150 d-lg-none  mb-4" />
                            <img alt="Ive had the pleasure over the course of this program to speak with amazing individuals, I encourage you all to reach out to other people in this program and make as many connections as you can. You will quickly find out that by speaking with other people in this cohort you can learn just about anything if you ask the right people." src={require("../static/img/ambassadors/quote3.svg")} className="h-100 d-none d-lg-block" />
                            <div className="p-0 col-lg-7 mx-lg-auto">
                                <p className="p-lg-3 mb-2"><strong>Nick D.</strong><br />
                                    Miami University<br />
                                    Spring 2023 XRPL Campus Ambassador</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    {/* How it Works */}
    <section className="container-new py-26">
        {/* flex. Col for mobile. Row for large. on large align content to the center  */}
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div className="order-1 mr-lg-4 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
                <div className="d-flex flex-column-reverse p-lg-3">
                    <h3 className="h4 h2-sm">{translate("Process to become a Campus Ambassador")}</h3>
                    <h6 className="eyebrow mb-3">{translate("How it Works")}</h6>
                </div>
                <p className="p-lg-3 mb-2 longform">{translate("Apply now to become an XRPL Campus Ambassador.")}</p>
                <div className="d-none d-lg-block p-lg-3">
                <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
                </div>
            </div>
            <div className="order-2 col-lg-6 px-0 ml-lg-2">
                <div className="row m-0">
                    <div className="col-12 col-lg-6 p-0 pr-lg-4">
                        <div className="px-lg-3 pb-3">
                            <img  src={require("../static/img/ambassadors/01.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Apply")}</h6>
                                <p>{translate("Submit an application to be considered for the Campus Ambassador program.")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="px-lg-3 pb-3 d-lg-none ">
                            <img  src={require("../static/img/ambassadors/02.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Interview")}</h6>
                                <p>{translate("Tell the XRPL community-led panel more about yourself and your interest in the program during an interview.")}</p>
                            </div>
                        </div>
                        <div className="px-lg-3 pb-3">
                            <img  src={require("../static/img/ambassadors/03.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Join")}</h6>
                                <p>{translate("Congrats on your new role! Join the global cohort of Ambassadors and meet with community participants during onboarding.")}</p>
                            </div>
                        </div>
                        {/* Hide on large */}
                        <div className="p-lg-3 pb-3 d-lg-none">
                            <img  src={require("../static/img/ambassadors/04.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Learn")}</h6>
                                <p> {translate("Participate in personalized learning and training sessions for Ambassadors on the XRPL and blockchain technology.")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 1 */}
                    {/* Show on large */}
                    <div className="col-12 col-lg-6 p-0 pl-lg-4 d-none d-lg-block mt-5">
                        <div className="px-lg-3 pb-3 mt-5">
                            <img  src={require("../static/img/ambassadors/02.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3">
                                <h6 className="mb-3">{translate("Interview")}</h6>
                                <p>{translate("Tell the XRPL community-led panel more about yourself and your interest in the program during an interview.")}</p>
                            </div>
                        </div>
                        <div className="p-lg-3 pb-3 ">
                            <img  src={require("../static/img/ambassadors/04.svg")} className="pl-lg-3" />
                            <div className="p-lg-3 pt-3 pb-lg-0">
                                <h6 className="mb-3">{translate("Learn")}</h6>
                                <p className="pb-lg-0">{translate("Participate in personalized learning and training sessions for Ambassadors on the XRPL and blockchain technology.")}</p>
                            </div>
                        </div>
                    </div>
                    {/* end col 2 */}
                </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
                <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
            </div>
        </div>
    </section>
    {/* Image Block */}
    <div>
        <img alt="Ripple Conferences and two people Sitting" src={require("../static/img/ambassadors/students-large.png")} className="w-100" />
    </div>
    {/* Global Community Carousel */}
    <section className="container-new pt-26">
        <div className="p-0 col-lg-5">
            <div className="d-flex flex-column-reverse p-lg-3">
                <h3 className="h4 h2-sm">{translate("Join a global cohort of Student Ambassadors")}</h3>
                <h6 className="eyebrow mb-3">{translate("Global Community")}</h6>
            </div>
        </div>
    </section>
    <div id="container-scroll">
        <div className="photobanner">
            <img src={require("../static/img/ambassadors/locations-row-1.png")} alt="Ambassador locations" height="48px" className="px-5" />
            <img src={require("../static/img/ambassadors/locations-row-1.png")} alt="Ambassador locations" height="48px" className="px-5" />
            <img src={require("../static/img/ambassadors/locations-row-1.png")} alt="Ambassador locations" height="48px" className="px-5" />
        </div>
        <div className="photobanner photobanner-bottom">
            <img src={require("../static/img/ambassadors/locations-row-2.png")} alt="Ambassador locations" height="48px" className="px-5" />
            <img src={require("../static/img/ambassadors/locations-row-2.png")} alt="Ambassador locations" height="48px" className="px-5" />
            <img src={require("../static/img/ambassadors/locations-row-2.png")} alt="Ambassador locations" height="48px" className="px-5" />
        </div>
    </div>
    {/* Connect */}
    <section className="container-new py-26">
        {/* flex. Col for mobile. Row for large. on large align content to the center  */}
        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
            <div className="order-1 mb-4 pb-3 mb-lg-0 pb-lg-0 col-lg-6 px-0">
                <div className="d-flex flex-column-reverse p-lg-3">
                    <h3 className="h4 h2-sm">{translate("Stay connected to the XRPL Campus Ambassadors")}</h3>
                    <h6 className="eyebrow mb-3">{translate("Connect")}</h6>
                </div>
                <p className="p-lg-3 mb-2 longform">{translate("To stay up-to-date on the latest activity, meetups, and events of the XRPL Campus Ambassadors be sure to follow these channels:")}</p>
                <div className="d-none d-lg-block p-lg-3">
                    <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
                </div>
            </div>
            <div className="order-2 col-lg-6 px-0 ml-lg-5">
                <div className="row align-items-center m-0">
                    <div className="col-12 col-lg-6 p-0 pr-lg-4">
                        <div className="p-lg-3 mb-3 pb-3">
                            <img alt="meetup" src={require("../static/img/ambassadors/icon_meetup.svg")} className="mb-3" />
                            <div>
                                <h6 className="mb-3"><a className="btn-arrow" href="https://www.meetup.com/pro/xrpl-community/">{translate("MeetUp")}</a></h6>
                                <p>{translate("Attend an XRPL Meetup in your local area")}</p>
                            </div>
                        </div>
                        <div className="p-lg-3 mb-3 pb-3">
                            <img alt="devto" src={require("../static/img/ambassadors/icon_devto.svg")} className="mb-3" />
                            <div>
                                <h6 className="mb-3"><a className="btn-arrow" href="https://dev.to/t/xrpl">{translate("Dev.to Blog")}</a></h6>
                                <p>{translate("Read more about the activity of the XRPL Ambassadors")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 p-0 pl-lg-4">
                        <div className="p-lg-3 mb-3 pb-3 ">
                            <img alt="discord" src={require("../static/img/ambassadors/icon_discord.svg")} className="mb-3" />
                            <div>
                                <h6 className="mb-3"><a className="btn-arrow" href="https://xrpldevs.org">{translate("Discord")}</a></h6>
                                <p>{translate("Join the conversation on the XRPL Developer Discord")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-lg-none order-3 mt-4 pt-3">
              <button data-tf-popup="rTioxhMY" data-tf-iframe-props="title=XRPL Campus Ambassador" data-tf-medium="snippet" className="btn btn-primary btn-arrow-out" data-tf-hidden="utm_source=xxxxx,utm_medium=xxxxx,utm_campaign=xxxxx,utm_term=xxxxx,utm_content=xxxxx">{translate("Apply for Fall 2023")}</button>
            </div>
        </div>
    </section>
</div>

    </div>
  )
}

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



const LandingPage = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <>
            <section>
                <div className="background">
                    <div className="container">
                        <div className="row pt-5">
                            <div className="col-md-6 ps-3 pt-5 ms-5">
                                <span className="welComeLine">Welcome to Prison Management System</span>
                            </div>
                            <div className="col-md-6 ps-3 pt-4 ms-5">
                                <h3 className="tagLine">Efficient. Secure. Reliable.</h3>
                            </div>
                            <div className="col-md-6 ps-4 pt-4 ms-5">
                                {isAuthenticated ? (
                                    <Link to="/dashboard" className="pointerCursor">
                                        <span className="getStartedButton ">Get Started</span>
                                    </Link>
                                ) : (
                                    <Link to="/login" className="pointerCursor">
                                        <span className="getStartedButton ">Get Started</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container pt-5 pb-5 ">
                    <div className="headings brownColor ps-3">Why Choose Us?</div>
                    <div className="container  ">
                        <div className="row pt-5  ">
                            <div className="col text-center">
                                <img
                                    className="whyPuC "
                                    src="./prison.jpg"
                                    alt="whyPic"
                                />
                            </div>
                            <div className="col">
                                <div>
                                    <h4 className="brownColor pt-2 mt-1">Efficient Security Measures</h4>
                                    <p
                                        className="pt-1"
                                        style={{ fontWeight: "500", fontSize: "1rem" }}
                                    >
                                        Ensure the safety and security of both inmates and staff with advanced monitoring and control systems.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="brownColor pt-3">Streamlined Operations</h4>
                                    <p
                                        className="pt-1"
                                        style={{ fontWeight: "500", fontSize: "1rem" }}
                                    >
                                        Leverage powerful tools to manage daily prison operations, including inmate tracking, resource allocation, and incident management.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="brownColor pt-3">Rehabilitation Programs</h4>
                                    <p
                                        className="pt-1"
                                        style={{ fontWeight: "500", fontSize: "1rem" }}
                                    >
                                        Explore a variety of programs designed to aid in the rehabilitation and reintegration of inmates into society.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="container mt-3 mb-3 pt-5 pb-5 ">
                    <div className="container  ">
                        <div className="row pt-5  ">
                            <div className="col ">
                                <div className="headings ps-3">Key Features</div>
                                <div className=" pt-4 ps-5 ms-5">
                                    <button className="brownButton " type="button">
                                        About Us
                                    </button>
                                </div>
                            </div>
                            <div className="col pe-5">
                                <div>
                                    <p
                                        className="pt-1  "
                                        style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                    >
                                        •   Inmate Management: Track inmate details, records, and status efficiently.</p>
                                    <p
                                        className="pt-1  "
                                        style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                    >
                                        •	Staff Management: Simplify schedules, roles, and responsibilities.
                                    </p><p
                                        className="pt-1  "
                                        style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                    >
                                        •	Facility Management: Oversee operations, inventory, and infrastructure.
                                    </p><p
                                        className="pt-1  "
                                        style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                    >
                                        •	Visitor Management: Schedule and monitor visitations with ease.
                                    </p><p
                                        className="pt-1  "
                                        style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                    >

                                        •	Reporting & Analytics: Generate detailed reports for better decision.

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section>
                <div className="container  mt-5 pt-5 pb-5 ps-3 ">
                    <div className="row">
                        <div className="col-6 ">
                            <div className="headings brownColor pt-3 ps-3">
                                Key Features
                                {" "}
                            </div>
                            <p
                                className=" ps-3 pt-5"
                                style={{ fontWeight: "600", fontSize: "1.05rem" }}
                            >
                                Inmate Management: Track inmate details, records, and status efficiently.

                            </p>

                            <div className="row align-items-center mt-2 ps-5 pt-4">
                                <p className=" ps-3 pt-4"
                                    style={{ fontWeight: "600", fontSize: "1.05rem" }}>Staff Management: Simplify schedules, roles, and responsibilities.
                                </p>
                            </div>
                            <div className="row align-items-center ps-3 pt-4">
                                <p
                                    className="col "
                                    style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                >
                                    Facility Management: Oversee operations, inventory, and infrastructure.

                                </p>
                                <p
                                    className="col"
                                    style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                >
                                    Visitor Management: Schedule and monitor visitations with ease.

                                </p>
                                <p
                                    className="col"
                                    style={{ fontWeight: "600", fontSize: "1.05rem" }}
                                >
                                    Reporting & Analytics: Generate detailed reports for better decision-making.

                                </p>
                            </div>

                            <div className="text-center pt-4 pe-5 me-1">
                                <button className="blackButton " type="button">
                                    Find Jobs
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 col-6 text-center">
                            <img
                                className="jobPic "
                                src={"./background.jpg"}
                                alt="whyPic"
                            />
                        </div>
                    </div>
                </div>
            </section> */}
            <section>
                <div className="container mt-5 pt-5 pb-5 text-center">
                    <div className="headings brownColor ps-3">Contact Us!</div>
                    <div>
                        <p
                            className="pt-2  "
                            style={{ fontWeight: "600", fontSize: "1.05rem" }}
                        >
                            Manage facilities smarter and safer with PIMS.
                        </p>
                    </div>
                    <div className="pt-2">

                        {isAuthenticated ? (
                            <Link to="/dashboard" className="pointerCursor">
                                <button className="brownButton me-1" type="button">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link to="/login" className="pointerCursor">
                                <button className="brownButton me-1" type="button">
                                    Login
                                </button>
                            </Link>
                        )}
                        <button className="blackButton ms-1" type="button">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;

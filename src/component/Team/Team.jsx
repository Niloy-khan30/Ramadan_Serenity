import React, { useEffect, useState } from 'react';

const Team = () => {

    const [team, setTeam] = useState([])
    useEffect(() => {
        fetch('team.json')
            .then(res => res.json())
            .then(data => {
                setTeam(data.profiles)
            })
    }, [])


    console.log(team)




    return (
        <div>
            < div className='text-center space-y-4' >
                <h3 className='text-2xl text-orange-500'>Team</h3>
                <h3 className='text-4xl font-bold  '>Meet Our Team</h3>
                <p>the majority have suffered alteration in some form, by injected humour, or randomised <br /> words which don't look even slightly believable.  </p>
            </div >
            <div className="carousel carousel-center  rounded-box mx-auto space-x-4 p-4">


                {
                    team.map(t => <div className="carousel-item">
                        <div className='shadow-2xl p-7 rounded text-center'>
                            <img
                                src={t.image}
                                className="rounded-box w-[312px]" />
                            <h3 className='text-2xl font-bold mb-2'>{t.name}</h3>
                            <h3>{t.title}</h3>

                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default Team;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaAirFreshener } from 'react-icons/fa'; // Import icons from react-icons
import { IconType } from 'react-icons/lib';
import './InfoCard.css'
interface infocardprops{
    FaIcon?: IconType;
    to?: string;
    title?: string;
    action?: string;
    body?: string;
}

const InfoCard: React.FC<infocardprops> = ({FaIcon=FaAirFreshener, to="/", title="TITLE", action="Learn More", body="This is a sample body. Update with info."}) => {
  return (
    <div className="infocard">
        <NavLink to={to} className="icon-item">
            <FaIcon size={50} />
            <h3>{title}</h3>
            <p>{body}</p>
            <span>{action}</span>
        </NavLink>
    </div>
  );
};

export default InfoCard;

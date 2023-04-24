import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Rowan University',
    description: 'One of the best Universities in the country!',
    imageUrl:
      'http://elvis.rowan.edu/~burnse/assets/rowan-campus.jpeg',
    address: '201 Mullica Hill Rd, Glassboro, NJ 08028',
    location: {
      lat: 39.7099689,
      lng: -75.1213872
    },
    creator: 'u1'
  }
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;

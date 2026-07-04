import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Loader } from './components/Loader';
import { useEffect, useState } from 'react';
import { getPeople } from './api';
import { Person } from './types/Person';
import { PeopleTable } from './components/Loader/PeopleTable';

import './App.scss';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setIsLoading(true);

    getPeople()
      .then(data => {
        setPeople(data);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return (
      <p className="has-text-danger" data-cy="peopleLoadingError">
        Something went wrong
      </p>
    );
  }

  if (people.length === 0) {
    return <p data-cy="noPeopleMessage">There are no people on the server</p>;
  }

  return (
    <>
      <h1 className="title">People Page</h1>

      <PeopleTable people={people} selectedSlug={slug} />
      {/* <table
        data-cy="peopleTable"
        className="table is-striped is-hoverable is-narrow is-fullwidth"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Sex</th>
            <th>Born</th>
            <th>Died</th>
            <th>Mother</th>
            <th>Father</th>
          </tr>
        </thead>

        <tbody>
          {people.map(person => {
            const mother = people.find(p => p.name === person.motherName);
            const father = people.find(p => p.name === person.fatherName);

            return (
              <tr
                key={person.slug}
                data-cy="person"
                className={person.slug === slug ? 'has-background-warning' : ''}
              >
                <td>
                  <Link
                    to={`/people/${person.slug}`}
                    className={person.sex === 'f' ? 'has-text-danger' : ''}
                  >
                    {person.name}
                  </Link>
                </td>
                <td>{person.sex}</td>
                <td>{person.born}</td>
                <td>{person.died}</td>
                <td>
                  {person.motherName ? (
                    mother ? (
                      <Link
                        to={`/people/${mother.slug}`}
                        className={mother.sex === 'f' ? 'has-text-danger' : ''}
                      >
                        {person.motherName}
                      </Link>
                    ) : (
                      person.motherName
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {person.fatherName ? (
                    father ? (
                      <Link
                        to={`/people/${father.slug}`}
                        className={father.sex === 'f' ? 'has-text-danger' : ''}
                      >
                        {person.fatherName}
                      </Link>
                    ) : (
                      person.fatherName
                    )
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </>
  );
};

export const App = () => {
  // const [people, setPeople] = useState<Person[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [hasError, setHasError] = useState(false);

  return (
    <div data-cy="app">
      <nav
        data-cy="nav"
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link
              className={
                useLocation().pathname === '/'
                  ? 'navbar-item has-background-grey-lighter'
                  : 'navbar-item'
              }
              to="/"
            >
              Home
            </Link>

            <Link
              className={
                useLocation().pathname.startsWith('/people')
                  ? 'navbar-item has-background-grey-lighter'
                  : 'navbar-item'
              }
              to="/people"
            >
              People
            </Link>
          </div>
        </div>
      </nav>

      <main className="section">
        <div className="container">
          <Routes>
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/" element={<h1 className="title">Home Page</h1>} />
            <Route path="people">
              <Route index element={<PeoplePage />} />
              <Route path=":slug" element={<PeoplePage />} />
            </Route>
            <Route
              path="*"
              element={<h1 className="title">Page not found</h1>}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

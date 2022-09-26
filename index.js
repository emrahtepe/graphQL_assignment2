const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { users, events, locations, participants } = require('./data.json');

const typeDefs = gql`
type User{
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
}

type Event{
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: String!
    user_id: String!
    user: User!
    location: Location!
    participants: [Participant!]!
}

type Location{
    id: ID!
    name: String!
    desc: String!
    lat: String!
    lng: String!
}

type Participant{
    id: ID!
    user_id: String!
    event_id: String!
    user: User!
    event: Event!
}

type Query {
    users: [User!]!
    user(id:ID!): User!

    events: [Event!]!
    event(id:ID!): Event!

    locations: [Location!]!
    location(id:ID!): Location!

    participants: [Participant!]!
    participant(id:ID!): Participant!
}
  `;

const resolvers = {
    Query: {
        users: () => users,
        user: (parent, args) => {
            const user = users.find(user => user.id == args.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        },
        events:() => events,
        event: (parent, args) => {
            const event = events.find(event => event.id == args.id);
            if (!event) {
                throw new Error('Event not found');
            }
            return event;
        },
        locations: () => locations,
        location: (parent, args) => {
            const location = locations.find(location => location.id == args.id);
            if (!location) {
                throw new Error('Location not found');
            }
            return location;
        },
        participants: () => participants,
        participant: (parent, args) => {
            const participant = participants.find(participant => participant.id == args.id);
            if (!participant) {
                throw new Error('Participant not found');
            }
            return participant;
        },
    },
    User: {
        events: (parent, args) => events.filter(event => event.user_id === parent.id),
    },
    Event: {
        user: (parent, args) => users.find(user => user.id === parent.user_id),
        location: (parent, args) => locations.find(location => location.id === parent.location_id),
        participants: (parent, args) => participants.filter(participant => participant.event_id === parent.id),
    },
    Participant: {
        user: (parent, args) => users.find(user => user.id === parent.user_id),
        event: (parent, args) =>events.find(event => event.id === parent.event_id),
    }
};

const server = new ApolloServer({ typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground()] });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
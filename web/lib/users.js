

export function getUserByUsername(username) {
  // TODO: return user if exists, null otherwise
  return dummyUsers[4];
}


export function getAllUsers() {
  // TODO: get actual user list
  return dummyUsers;
}


export function getTutorUsernameIds() {
  
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       username: 'gggggg'
  //     }
  //   },
  // ]
  return getAllUsers()
    .filter((user) => user.params.role === "tutor")
    .map((user) => {
      return {
        params: {
          id: user.params.username,
        },
      };
    });
}


const dummyUsers = [
  {
    params: {
      role: "student",
      username: "BobJohn123",
      passwordHash: "fherbvhdfbkj",
      dateJoined: new Date(),
    }
  },
  {
    params: {
      role: "student",
      username: "BobJohn123",
      passwordHash: "jkhbjbvrbbekbkrb",
      dateJoined: new Date(),
    }
  },
  {
    params: {
      role: "student",
      username: "BobJohn123",
      passwordHash: "wfhwhf",
      dateJoined: new Date(),
    }
  },
  {
    params: {
      role: "student",
      username: "BobJohn123",
      passwordHash: "dncknckw",
      dateJoined: new Date(),
    }
  },
  {
    params: {
      role: "tutor",
      username: "MrMcTutor",
      passwordHash: "fvhjfvhjefv",
      dateJoined: new Date(),
    }
  },
  {
    params: {
      role: "tutor",
      username: "Robing",
      passwordHash: "jhhjdvdvvgv",
      dateJoined: new Date(),
    }
  },
];
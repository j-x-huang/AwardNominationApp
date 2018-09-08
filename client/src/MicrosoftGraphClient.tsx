import * as MicrosoftGraph from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraphTypes from "@microsoft/microsoft-graph-types";
import { acquireToken } from './auth';
// import { constants } from "zlib";

/**
 * Retrieves the details of all users in the Azure AD
 * @param callback 
 */
export const getAllUserDetails = (callback: (err: any, usersDetails: any) => void) => {
  acquireToken((error, token) => {

    if (error) {
      callback(error, null);
      return;
    }

    // Initialises the Microsoft Graph Client using our acquired token
    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
          done(null, token);
      }
    });

    // Makes an API call to Microsoft Graph to fetch all users in the Azure AD
    client
      .api('/users/')
      .version('beta')
      .get((err, res) => {
          if (err) {
              callback(err, null)
              return;
          }
          
          const users:[MicrosoftGraphTypes.User] = res.value;
          const usersDetails = new Array<any>();

          // Creates a condensed model of the users as well as retrieving the url for their profile picture
          // tslint:disable-next-line:forin
          for (const user of users) {
            const condensedUserDetails = {
              email: user.mail ? user.mail : '',
              id: user.id,
              name: user.displayName ? user.displayName : '',
              profilePic: '',
            };

            usersDetails.push(condensedUserDetails);

            // Retrieves the specific user's profile picture
            /* NOTE: This causes the fetch to be very slow as an individual api call is needed
                for every user to fetch their photo.
                Possibly move this onto another function and have whatever component (i.e. Card?) is 
                responsible to rendering the details to fetch the image themselves. 
                Another option is to preload the images in Firebase and fetch it from there
            */
            // client
            //   .api(`/users/${user.id}/photos/48x48/$value`)
            //   .version('beta')
            //   .responseType(MicrosoftGraph.ResponseType.BLOB)
            //   .get()
            //   .then((picBlob) => {
            //       const url = window.URL;
            //       const imageUrl = url.createObjectURL(picBlob);

            //       condensedUserDetails.profilePic = imageUrl;
            //   }).catch()
            //     .finally(() => {
            //       usersDetails.push(condensedUserDetails);

            //       // ensures that we don't return until all images have been retrieved
            //       usersCount--;
            //       if (usersCount === 0) {
            //         callback(null, usersDetails);
            //       }
            //   });
          }
          callback(null, usersDetails);
      });
  })
}

export const getMyImage = (callback: (profilePic: any, err: any) => void) => {
  acquireToken((error, token) => {
    const defaultPic = 'http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg'
    if (error) {
      callback(defaultPic, null);
    }


    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
          done(null, token);
      }
    });


    client
    .api(`/me/photos/48*48/$value`)
    .version('beta')
      .responseType(MicrosoftGraph.ResponseType.BLOB)
      .get()
      .then((blob) => {
        const url = window.URL;
        const imageUrl = url.createObjectURL(blob);


        const profilePic = ( imageUrl === '' ? defaultPic : imageUrl); 

        callback(profilePic, null)
      }).catch((err) => {

        callback(null, err);
        return;
      })

  })
}

/**
 * Retrieves a specific user from Azure AD
 * @param id the object-id of the user
 * @param callback 
 */
export const getUserDetails = (id: string, callback: (err: any, userDetails: any) => void) => {
  acquireToken((error, token) => {

    if (error) {
      callback(error, null);
      return;
    }

    // Initialises the Microsoft Graph Client using our acquired token
    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
          done(null, token);
      }
    });

    // Makes an API call to Microsoft Graph to fetch the user in the Azure AD
    client
      .api(`/users/${id}`)
      .get((err, res) => {
          if (err) {
              callback(err, null)
              return;
          }
          
          const user:MicrosoftGraphTypes.User = res;

          const condensedUserDetails = {
            email: user.mail ? user.mail : '',
            id: user.id,
            name: user.displayName ? user.displayName : '',
            profilePic: '',
          };

          client
            .api(`/users/${user.id}/photos/225*225/$value`)
            .version('beta')
            .responseType(MicrosoftGraph.ResponseType.BLOB)
            .get()
            .then((picBlob) => {
                const url = window.URL;
                const imageUrl = url.createObjectURL(picBlob);

                condensedUserDetails.profilePic = imageUrl;
            })
            .finally(() => {
              callback(null, condensedUserDetails);
            });
      });
  })
}

/**
 * Fetches a list of user details based on objectIds passed in
 * @param objectIds the list of ids to which user details should be fetched
 * @param callback function to call with the result
 */
export const getUsersByObjectId = (objectIds: string[], callback: (err: any, users: any[]) => void) => {
  acquireToken((error, token) => {

    if (error) {
      callback(error, []);
      return;
    }

    // Initialises the Microsoft Graph Client using our acquired token
    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
          done(null, token);
      }
    });

    // Makes an API call to Microsoft Graph to fetch the users in the Azure AD
    client
    .api('/directoryObjects/getByIds')
    .post({
      "ids": objectIds,
      "types":["user"]
    }, (err, res) => {
      const users = new Array<any>();

      if (err) {
        callback(err, []);
        return;
      }

      res.value.forEach((user: MicrosoftGraphTypes.User) => {
        const userDetails = {
          email: user.mail ? user.mail : '',
          id: user.id,
          name: user.displayName ? user.displayName : '',
          profilePic: '',
        };
        users[user.id] = userDetails;
      })

      callback(null, users);
    });
  })
}



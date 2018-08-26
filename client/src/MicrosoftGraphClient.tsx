import * as MicrosoftGraph from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraphTypes from "@microsoft/microsoft-graph-types";
import { acquireToken } from './auth';

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
          let usersCount = users.length;

          // Creates a condensed model of the users as well as retrieving the url for their profile picture
          // tslint:disable-next-line:forin
          for (const user of users) {
            const condensedUserDetails = {
              email: user.mail ? user.mail : '',
              id: user.id,
              name: user.displayName ? user.displayName : '',
              profilePic: '',
            };

            // Retrieves the specific user's profile picture
            /* NOTE: This causes the fetch to be very slow as an individual api call is needed
                for every user to fetch their photo.
                Possibly move this onto another function and have whatever component (i.e. Card?) is 
                responsible to rendering the details to fetch the image themselves. 
                Another option is to preload the images in Firebase and fetch it from there
            */
            client
              .api(`/users/${user.id}/photos/48x48/$value`)
              .version('beta')
              .responseType(MicrosoftGraph.ResponseType.BLOB)
              .get()
              .then((picBlob) => {
                  const url = window.URL;
                  const imageUrl = url.createObjectURL(picBlob);

                  condensedUserDetails.profilePic = imageUrl;
              }).catch()
                .finally(() => {
                  usersDetails.push(condensedUserDetails);

                  // ensures that we don't return until all images have been retrieved
                  usersCount--;
                  if (usersCount === 0) {
                    callback(null, usersDetails);
                  }
              });
          }
      });
  })
}




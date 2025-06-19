import { isArray, isObject } from 'util';
import { MantineColorScheme, MantineTheme } from '@mantine/core';
import { BASE_MEDIA_URL, DEFAULT_APP_URL } from './constants';

export function displayErrors(form: any, errors: any, parentKey: string | null = null) {
  for (const field in errors) {
    if (errors.hasOwnProperty(field)) {
      const key = parentKey ? `${parentKey}.${field}` : field;
      const value = errors[field];

      if (isArray(value)) {
        form.setFieldError(key, value?.join(", "))
      }
      else if (isObject(value)) {
        displayErrors(form, value, key);
      }
    }
  }
}


export function displayBulkCreateErrors(form: any, errors: any, field_name: string | null = null) {
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];
    for (const field in error) {
      const key = `${field_name}.${i}.${field}`
      const value = error[field];
      if(isArray(value)){
        form.setFieldError(key, value?.join(", "))
      }else if (isObject(value)) {
        displayErrors(form, value, key);
      }
    }
  }
}


export const getTheme = (colorScheme: MantineColorScheme) => {
  return colorScheme === "dark"
}

export const getPrimaryColor = (theme: MantineTheme) => {
  return theme?.colors?.orange[6]
}

// export const formatCurrency = (price) => {
//     return Number(price).toLocaleString()
// }

export const formatCurrency = (price: any) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  });

  return formatter.format(Number(price));
};

export const checkIfEndwithSlash = (st: string) => {
  const len = st.length;
  const end = st.substring(len - 1, len)
  const regex = new RegExp(/\//)
  return regex.test(end)
}

export const removeLastSlash = (st: string) => {
  const len = st.length;
  return st.substring(0, len - 1);
}

export const matchTest = (str1: string, str2: string) => {
  let string1 = str1;
  let string2 = str2;

  const str1endswithslash = checkIfEndwithSlash(string1)
  const str2endswithslash = checkIfEndwithSlash(string2)

  if (str1endswithslash) {
    string1 = removeLastSlash(string1)
  }
  if (str2endswithslash) {
    string2 = removeLastSlash(string2)
  }

  const testpath = `^${string1}$`

  const regex = new RegExp(testpath, "gi");

  return regex.test(string2);
}

export const matchCurrentPathWithGivenLink = (currentPath: string, link: string) => {
  const currentPathWithoutQuery = currentPath.split("?")[0]; // Remove query parameters from current path
  const linkWithoutQuery = link.split("?")[0]; // Remove query parameters from link

  const currentPathWithTrailingSlash = addTrailingSlash(currentPathWithoutQuery); // Add trailing slash to current path if it doesn't have one
  const linkWithTrailingSlash = addTrailingSlash(linkWithoutQuery); // Add trailing slash to link if it doesn't have one

  const regex = new RegExp(`^${linkWithTrailingSlash}$`, "gi");

  return regex.test(currentPathWithTrailingSlash);
};

// Helper function to add a trailing slash to a path if it doesn't have one
const addTrailingSlash = (path: string) => {
  return path.endsWith("/") ? path : `${path}/`;
};







export const createImageURl = (file: File) => {
  return URL.createObjectURL(file);
}


export const toDate = (datestring: any, full = false) => {
  if (full) {
    return `${new Date(datestring).toDateString()} (${new Date(datestring).toLocaleTimeString()})`
  }
  return new Date(datestring).toDateString()
}

export const limitChars = (word: string, limit: number) => {
  if (word) {
    if (word.length <= limit) {
      return word;
    }
    return word.substring(0, limit) + "...";
  }
  return ""
}



// export function addFiltersToUrl(url: string, filters: any) {
//     let updatedUrl = url;

//     // Check if filters exist
//     if (filters && Object.keys(filters).length > 0) {
//         const params = new URLSearchParams();

//         // Iterate over each filter and add it as a query parameter
//         Object.entries(filters).forEach(([key, value]) => {
//             params.append(key, value);
//         });

//         // Append the query parameters to the URL
//         updatedUrl += `?${params.toString()}`;
//     }

//     return updatedUrl;
// }


export function updatePageFilter(path: string, page: any) {
  const url = new URL(path, DEFAULT_APP_URL); // Parse the existing URL

  // Get the existing query parameters as an object
  const params = Object.fromEntries(url.searchParams.entries());

  // Update the "page" filter
  params.page = page;

  // Create a new URL with the updated query parameters
  const updatedUrl = new URL(url.pathname, DEFAULT_APP_URL);
  updatedUrl.search = new URLSearchParams(params).toString();

  return updatedUrl.toString();
}


export const getTextFromSlug = (slug: string) => {
  let s = "Ds"
  return slug?.replaceAll("-", " ").toUpperCase()
}

export const requestGeolocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            resolve('granted');
          } else if (result.state === 'prompt') {
            navigator.geolocation.getCurrentPosition(
              () => {
                resolve('prompt');
              },
              (error) => {
                reject(error.message);
              }
            );
          } else {
            reject('Geolocation permission denied.');
          }
        })
        .catch((error) => {
          reject(error.message);
        });
    } else {
      reject('Permissions API is not supported by this browser.');
    }
  });
};


export const getCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

export const loadMediaURL = (url: string) => {
  if(!url)return ""
  else if(url.startsWith('http')){
    return url
  }
  else{
    return `${BASE_MEDIA_URL}${url}`
  }
}
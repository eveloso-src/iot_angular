// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  mmiotadmin: 'http://10.0.2.10:8091/',
  metadataApiUrl: 'http://10.0.2.10:8081',
  mmUrl: 'http://10.0.2.10:8080/v1',
  dockerEngineApiUrl: 'http://10.0.2.10:4243',
  dockerRepo: 'localhost:5000'  // Please do not point this hostname to mmdev05 IP or anyother IP , this has to be
                                // localhost , because it Registry doesnt have any domain name, its localhost for now.
};

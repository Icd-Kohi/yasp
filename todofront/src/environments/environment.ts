interface AppConfig {
  apiEndpoint: string;
  production: boolean;
}
export const environment : AppConfig = {
  apiEndpoint: "http://localhost:8080",
  production: false
};

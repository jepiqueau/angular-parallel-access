# Angular SQLite Parallel Access Application
This is an application to demonstrate the use of the @capacitor-community/sqlite with the Write-Ahead Logging (WAL).
The WAL is automatically set-up in Android platform.
To enable the WAL on others platforms use the `PRAGMA journal_mode=WAL;`

## Maintainers

| Maintainer        | GitHub                                    | Social |
| ----------------- | ----------------------------------------- | ------ |
| Quéau Jean Pierre | [jepiqueau](https://github.com/jepiqueau) |        |

## Installation

To start clone the project
```bash
git clone https://github.com/jepiqueau/angular-parallel-access.git 
cd angular-parallel-access
git remote rm origin
npm install
```

```bash
npm run build
npx cap sync
npx cap sync @capacitor-community/electron
npm run build
npx cap copy
npx cap copy @capacitor-community/electron

```

## Running the app

### BROWSER

```
ionic serve
```

### ELECTRON

```
npx cap open @capacitor-community/electron
```

### IOS

```
npx cap open ios
```

### ANDROID

```
npx cap open android
```


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/jepiqueau"><img src="https://avatars3.githubusercontent.com/u/16580653?v=4" width="100px;" alt=""/><br /><sub><b>Jean Pierre Quéau</b></sub></a><br /><a href="https://github.com/jepiqueau/capacitor-video-player/commits?author=jepiqueau" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/CosminCraciun"><img src="https://avatars.githubusercontent.com/u/17962592?v=4" width="100px;" alt=""/><br /><sub><b>CosminCraciun</b></sub></a><br /><a href="https://github.com/jepiqueau/capacitor-video-player/commits?author=CosminCraciun" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


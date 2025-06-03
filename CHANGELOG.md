<!-- markdownlint-configure-file {"MD024": { "siblings_only": true } } -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added eslint checking.

### Changed

- Changed source code from javascript to typescript.

### Deprecated

### Removed

### Fixed

### Security

## [1.0.3] - 2025-05-31

### Added

- Examples directory.

### Fixed

- Missing score card issues.

## [1.0.2] - 2025-05-31

### Changed

- Changed readme image links to full domain links so they will show
  up properly at <https://flows.nodered.org/node/@hlovdal/node-red-display-property>.

## [1.0.1] - 2025-05-31

### Added

- Added support for displaying nested properties (e.g. `msg.data.attributes.brightness`).

### Changed

- Normalized and formalized formatting.
- Refactored the large body in `node.on("input", ...` and extracted smaller,
  independent functions for date/time processing.

## [1.0.0] - 2021-10-09

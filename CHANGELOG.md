# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-alpha.8] - 2026-03-29

### Fixed <!-- alpha.8 -->

- **Architectural Layout Bounds:** Stabilized SDUI Blade scrolling constraints by migrating `.sdui-base-blade-container` from error-prone absolute heights (`height: 100%`) to `flex: 1 1 0%`.
- **Angular Host Containment:** Added strict global CSS enforcement for the `sdui-base-blade` custom element to bypass Angular's `display: inline` default that previously broke layout containment.
- **Scroll Shrinkage Regression:** Addressed an issue where tall child items were compressed horizontally instead of triggering scrollbars by assigning `flex-shrink: 0` natively to all direct children of `sdui-blade-content-container`.
- **Type Safety & Strict Validation:** Stripped all legacy `$any` casting bypasses from the mock Kitchen Sink demo implementation to strictly conform to `SduiBladeNode` data signatures, and implemented a formal `createChildNode` factory method.
- **Documentation Standardization:** Standardized JSDocs across all SDK components exposing standard `Functionality` and `Impact on others` fields instead of internal placeholders. Alphabetized logic.

## [1.0.0-alpha.7] - 2026-03-28

### Added <!-- alpha.7 -->

- Exposed Renderer API and implemented exact app blade overrides in service.

### Changed <!-- alpha.7 -->

- Refactored and encapsulated mock blades with isolated `sdui-mock` selectors and architectural JSDocs.
- Enforced rigorous type safety mapping over `SduiNode` contracts.
- Restored architectural dot grid sandbox UI.

## [1.0.0-alpha.6] - 2026-03-28

### Changed <!-- alpha.6 -->

- Upgraded core dependencies to align with `@slashand/sdui-blade-core`.

## [1.0.0-alpha.5] - 2026-03-23

### Added <!-- alpha.5 -->

- Implemented native `PlatformLocation` popstate interception for browser forward/back navigation.
- Injected CSS variable fallbacks for framework-agnostic theming.

### Changed <!-- alpha.5 -->

- Enhanced `SduiBladeService` with `updateBladeProperties` and payload merge logic.
- Restructured README into dedicated documentation chapters.
- Updated architectural manifestos and AI Agent Guidelines (`AGENTS.md`).

### Fixed <!-- alpha.5 -->

- Fixed layout issue by applying block display to host component to prevent DOM collapse.
- Restored legacy `setBlades` method for backward compatibility.
- Fixed blade host lifecycle and optimized header buttons.
- Migrated theme CSS to formal architectural boundaries.

## [1.0.0-alpha.4] - 2026-03-22

### Fixed <!-- alpha.4 -->

- Removed host backdrop overlay for cleaner multi-blade stacking logic.
- Configured CI pipeline for continuous NPM package publishing.

## [1.0.0-alpha.0] - 2026-03-20

### Added <!-- alpha.0 -->

- Initial open-source release of the Agnostic Blade System Angular Wrapper.
- Analog APF strict compliance build step using `ng-packagr` and `Vitest`.
- Converted legacy structural components into APF exports.

load("@build_bazel_rules_nodejs//:index.bzl", "copy_to_bin", "npm_package_bin", "pkg_npm")
load("@npm//@bazel/typescript:index.bzl", "ts_project")
load("//tools:jest.bzl", "jest_test")

PACKAGE_NAME = "intl-locale"

pkg_npm(
    name = PACKAGE_NAME,
    srcs = ["package.json"],
    deps = [
        ":dist",
        ":lib",
    ],
)

SRCS = glob(["*.ts"])

SRC_DEPS = [
    "@npm//@types/node",
    "@npm//cldr-core",
    "//packages/intl-utils:dist",
    "//packages/intl-getcanonicallocales:dist",
]

ts_project(
    name = "dist",
    package_name = "@formatjs/%s" % PACKAGE_NAME,
    srcs = SRCS,
    declaration = True,
    declaration_map = True,
    extends = ["//:tsconfig.json"],
    source_map = True,
    tsconfig = "tsconfig.json",
    visibility = ["//visibility:public"],
    deps = SRC_DEPS,
)

ts_project(
    name = "lib",
    package_name = "@formatjs/%s" % PACKAGE_NAME,
    srcs = SRCS,
    declaration = True,
    declaration_map = True,
    extends = ["//:tsconfig.json"],
    outdir = "lib",
    source_map = True,
    tsconfig = "tsconfig.json",
    visibility = ["//visibility:public"],
    deps = SRC_DEPS,
)

filegroup(
    name = "types",
    srcs = [":dist"],
    output_group = "types",
)

jest_test(
    name = "unit",
    srcs = [
        "//:tsconfig.json",
    ] + SRCS + glob([
        "tests/**/*.ts",
        "tests/**/*.tsx",
        "tests/**/*.snap",
    ]),
    jest_config = ":jest.config.js",
    tags = [
        # Need to set the pwd to avoid jest needing a runfiles helper
        # Windows users with permissions can use --enable_runfiles
        # to make this test work
        "no-bazelci-windows",
        # TODO: why does this fail almost all the time, but pass on local Mac?
        "no-bazelci-mac",
    ],
    deps = [
        "@npm//@jest/transform",
        "@npm//ts-jest",
        "@npm//@types/jest",
        "//packages/intl-getcanonicallocales:types",
        "//packages/intl-utils:types",
    ] + SRC_DEPS,
)

# API Extractor
copy_to_bin(
    name = "setup-api-extractor",
    srcs = [
        "api-extractor.json",
        "package.json",
        "tsconfig.json",
    ],
)

npm_package_bin(
    name = "rollup-dts",
    outs = ["%s.d.ts" % PACKAGE_NAME],
    args = [
        "run",
        "--local",
        "--diagnostics",
        "-c",
        "$(@D)/api-extractor.json",
    ],
    data = [
        ":setup-api-extractor",
        ":types",
        "//:setup-api-extractor",
        "//packages/intl-utils:types",
    ],
    package = "api-extractor",
    tool = "@npm//@microsoft/api-extractor/bin:api-extractor",
)

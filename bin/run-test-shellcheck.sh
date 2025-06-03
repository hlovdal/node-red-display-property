#!/bin/sh

git ls-files \
	| grep '\.sh$' \
	| tr '\012' '\000' \
	| xargs -0 --no-run-if-empty shellcheck

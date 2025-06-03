TOPDIR = $(shell git rev-parse --show-toplevel)

all:
	echo "Run make git-test-init to add tests"

git-test-init:
	if ! git rev-parse --git-dir | grep -q /.git/worktrees; \
	then \
		echo "Run this in the worktree you use for tests" 1>&2; \
		exit 1; \
	fi
	git test add -t lint         "$(TOPDIR)/bin/wrapper.sh bin/run-test-lint.sh "
	git test add -t pre-commit   "$(TOPDIR)/bin/wrapper.sh bin/run-test-pre-commit.sh "
	git test add -t shellcheck   "$(TOPDIR)/bin/wrapper.sh bin/run-test-shellcheck.sh "

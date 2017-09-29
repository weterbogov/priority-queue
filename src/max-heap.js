const Node = require('./node');

class MaxHeap {
	constructor() {
		this.root = null;
		this.parentNodes = [];
		this.currentSize = 0;
	}

	push(data, priority) {
		var node = new Node(data, priority);
		this.currentSize++;
		this.insertNode(node);
		this.shiftNodeUp(node);
	}

	pop() {
		if (!this.isEmpty()) {
			var detached = this.detachRoot();
			if (this.currentSize > 1) {
				this.restoreRootFromLastInsertedNode(detached);
				this.shiftNodeDown(this.root);
			} else {
				this.restoreRootFromLastInsertedNode({});
			}
			this.currentSize--;
			return detached.data;
		}
	}

	detachRoot() {
		var nodeIndex = this.parentNodes.indexOf(this.root);
		if (nodeIndex != -1) {
			this.parentNodes.splice(nodeIndex, 1);
		}
		var detachRoot = this.root;
		this.root = null;
		return detachRoot;
	}

	restoreRootFromLastInsertedNode(detached) {
		var lastInsertedNode = this.parentNodes.pop();

		if (lastInsertedNode != null && typeof detached != 'undefined') {
			if (lastInsertedNode.parent != null
				&& lastInsertedNode.parent.right == lastInsertedNode
				&& lastInsertedNode.parent != detached) {
				this.parentNodes.unshift(lastInsertedNode.parent);
			}
			if (lastInsertedNode.parent != null) {
				lastInsertedNode.parent.removeChild(lastInsertedNode);
			}
			lastInsertedNode.left = detached.left;
			lastInsertedNode.right = detached.right;
			if (lastInsertedNode.left != null) {
				lastInsertedNode.left.parent = lastInsertedNode;
			}
			if (lastInsertedNode.right != null) {
				lastInsertedNode.right.parent = lastInsertedNode;
			}
			if (detached.left == null || detached.right == null) {
				this.parentNodes.unshift(lastInsertedNode);
			}
			this.root = lastInsertedNode;
		}
	}

	size() {
		return this.currentSize;
	}

	isEmpty() {
		if (this.root == null) {
			return true;
		}
		return false;
	}

	clear() {
		this.root = null;
		this.parentNodes = [];
		this.currentSize = 0;
	}

	insertNode(node) {
		if (this.root == null) {
			this.root = node;
			this.parentNodes.push(node);
			return;
		}
		if (this.parentNodes[0].left == null) {
			this.parentNodes[0].appendChild(node);
			this.parentNodes.push(node);
		} else {
			this.parentNodes[0].appendChild(node);
			this.parentNodes.push(node);
			this.parentNodes = this.parentNodes.slice(1, this.parentNodes.length);
		}
	}

	shiftNodeUp(node) {
		if (node.parent != null) {
			if (node.parent.priority >= node.priority) {
				return;
			}
			var nodeIndex = this.parentNodes.indexOf(node);
			var nodeParentIndex = this.parentNodes.indexOf(node.parent);
			if (nodeIndex != -1) {
				if (nodeParentIndex != -1) {
					var buf = this.parentNodes[nodeIndex];
					this.parentNodes[nodeIndex] = this.parentNodes[nodeParentIndex];
					this.parentNodes[nodeParentIndex] = buf;
				} else {
					this.parentNodes[nodeIndex] = node.parent;
				}
			}
			node.swapWithParent();
			this.shiftNodeUp(node);
		} else {
			this.root = node;
		}
	}

	shiftNodeDown(node) {
		var nodeChild;
		if (node.left != null && node.right != null) {
			if (node.left.priority > node.right.priority) {
				nodeChild = node.left;
			} else {
				nodeChild = node.right;
			}
		} else {
			if (node.left != null && node.left.priority > node.priority) {
				nodeChild = node.left;
			} else {
				return;
			}
		}
		var nodeIndex = this.parentNodes.indexOf(node);
		var nodeChildIndex = this.parentNodes.indexOf(nodeChild);
		if (nodeChildIndex != -1) {
			if (nodeIndex != -1) {
				var buf = this.parentNodes[nodeIndex];
				this.parentNodes[nodeIndex] = this.parentNodes[nodeChildIndex];
				this.parentNodes[nodeChildIndex] = buf;
			} else {
				this.parentNodes[nodeChildIndex] = node;
			}
		}
		if (node == this.root) {
			this.root = nodeChild;
		}
		nodeChild.swapWithParent();
		this.shiftNodeDown(node);
	}
}

module.exports = MaxHeap;


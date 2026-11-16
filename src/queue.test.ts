import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adjacent, shuffle } from './queue.ts';

test('переходы соблюдают очередь, включая случайный порядок', () => {
  const queue = ['c', 'a', 'b'];
  assert.equal(adjacent(queue, 'c', 1, false), 'a');
  assert.equal(adjacent(queue, 'b', -1, false), 'a');
  assert.equal(adjacent(queue, 'b', 1, false), undefined);
  assert.equal(adjacent(queue, 'c', -1, false), undefined);
});
test('повтор зацикливает очередь в обоих направлениях', () => {
  assert.equal(adjacent(['c', 'a', 'b'], 'b', 1, true), 'c');
  assert.equal(adjacent(['c', 'a', 'b'], 'c', -1, true), 'b');
});
test('перемешивание сохраняет все треки и не меняет исходный список', () => {
  const source = ['a', 'b', 'c', 'd'];
  const result = shuffle(source);
  assert.deepEqual([...result].sort(), source);
  assert.deepEqual(source, ['a', 'b', 'c', 'd']);
  assert.notEqual(result, source);
});
